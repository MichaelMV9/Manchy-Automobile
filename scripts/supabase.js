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
    }
};

const InquiryService = {
    async submitInquiry(inquiryData) {
        const { data, error } = await supabaseClient
            .from('inquiries')
            .insert([inquiryData])
            .select();

        if (error) throw error;
        return data;
    }
};

const TransactionService = {
    async createTransaction(transactionData) {
        const { data, error } = await supabaseClient
            .from('transactions')
            .insert([transactionData])
            .select();

        if (error) throw error;
        return data;
    },

    async updateTransaction(id, updates) {
        const { data, error } = await supabaseClient
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    }
};
