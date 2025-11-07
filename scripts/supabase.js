const supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

const CarService = {
    async getAllCars() {
        const { data, error } = await supabaseClient
            .from('cars')
            .select('*')
            .eq('status', 'Available')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getFeaturedCars(limit = 6) {
        const { data, error } = await supabaseClient
            .from('cars')
            .select('*')
            .eq('is_featured', true)
            .eq('status', 'Available')
            .limit(limit);

        if (error) throw error;
        return data;
    },

    async getCarById(id) {
        const { data, error } = await supabaseClient
            .from('cars')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async filterCars(filters) {
        let query = supabaseClient
            .from('cars')
            .select('*')
            .eq('status', 'Available');

        if (filters.brand) {
            query = query.eq('brand', filters.brand);
        }
        if (filters.condition) {
            query = query.eq('condition', filters.condition);
        }
        if (filters.transmission) {
            query = query.eq('transmission', filters.transmission);
        }
        if (filters.minPrice) {
            query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice) {
            query = query.lte('price', filters.maxPrice);
        }
        if (filters.year) {
            query = query.eq('year', filters.year);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getUniqueBrands() {
        const { data, error } = await supabaseClient
            .from('cars')
            .select('brand')
            .eq('status', 'Available');

        if (error) throw error;

        const uniqueBrands = [...new Set(data.map(car => car.brand))].sort();
        return uniqueBrands;
    },

    async createCar(carData) {
        // Remove ID if accidentally provided - it's auto-generated
        const cleanData = { ...carData };
        delete cleanData.id;
        delete cleanData.created_at;
        delete cleanData.updated_at;

        const { data, error } = await supabaseClient
            .from('cars')
            .insert([cleanData])
            .select();

        if (error) {
            console.error('Error creating car:', error);
            throw error;
        }
        return data;
    },

    async updateCar(id, updates) {
        // Ensure ID and timestamps are not in the updates
        const cleanUpdates = { ...updates };
        delete cleanUpdates.id;
        delete cleanUpdates.created_at;
        delete cleanUpdates.updated_at;

        const { data, error } = await supabaseClient
            .from('cars')
            .update(cleanUpdates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating car:', error);
            throw error;
        }
        return data;
    }
};

const StaffService = {
    async getAllStaff() {
        const { data, error } = await supabaseClient
            .from('staff')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data;
    },

    async createStaff(staffData) {
        // Remove ID if accidentally provided - it's auto-generated
        const cleanData = { ...staffData };
        delete cleanData.id;
        delete cleanData.created_at;

        const { data, error } = await supabaseClient
            .from('staff')
            .insert([cleanData])
            .select();

        if (error) {
            console.error('Error creating staff:', error);
            throw error;
        }
        return data;
    },

    async updateStaff(id, updates) {
        // Ensure ID and timestamps are not in the updates
        const cleanUpdates = { ...updates };
        delete cleanUpdates.id;
        delete cleanUpdates.created_at;

        const { data, error } = await supabaseClient
            .from('staff')
            .update(cleanUpdates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating staff:', error);
            throw error;
        }
        return data;
    }
};

const InquiryService = {
    async submitInquiry(inquiryData) {
        const cleanData = { ...inquiryData };
        delete cleanData.id;

        const { data, error } = await supabaseClient
            .from('inquiries')
            .insert([cleanData])
            .select();

        if (error) {
            console.error('Error submitting inquiry:', error);
            throw error;
        }

        try {
            const carDetails = inquiryData.car_id ?
                await CarService.getCarById(inquiryData.car_id) : null;

            const carInfo = carDetails ?
                `${carDetails.brand} ${carDetails.model} (${carDetails.year})` :
                'General Inquiry';

            await fetch(`${CONFIG.SUPABASE_URL}/functions/v1/send-inquiry-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    customerName: cleanData.customer_name,
                    customerEmail: cleanData.customer_email,
                    customerPhone: cleanData.customer_phone,
                    inquiryType: cleanData.inquiry_type,
                    message: cleanData.message,
                    carDetails: carInfo
                })
            });
        } catch (emailError) {
            console.log('Email notification error (non-critical):', emailError);
        }

        return data;
    }
};

const TransactionService = {
    async createTransaction(transactionData) {
        // Remove ID if accidentally provided - it's auto-generated
        const cleanData = { ...transactionData };
        delete cleanData.id;

        const { data, error } = await supabaseClient
            .from('transactions')
            .insert([cleanData])
            .select();

        if (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
        return data;
    },

    async updateTransaction(id, updates) {
        // Ensure ID is not in the updates object
        const cleanUpdates = { ...updates };
        delete cleanUpdates.id;

        const { data, error } = await supabaseClient
            .from('transactions')
            .update(cleanUpdates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
        return data;
    }
};
