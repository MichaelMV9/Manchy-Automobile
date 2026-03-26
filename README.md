# Manchy Automobile - Premium E-Commerce Website

A premium automotive e-commerce website featuring a luxury black, gold, and white theme. Built with HTML, CSS, and vanilla JavaScript, integrated with Supabase for data management and Paystack for secure payments.

## 🌟 Features

- **Homepage**: Auto-sliding hero background with showroom images, featured vehicles, and quick search
- **All Cars Page**: Advanced filtering by brand, condition, transmission, year, and price range
- **Car Details**: Image gallery, specifications, Paystack payment integration, and inquiry forms
- **About Us**: Company values, mission, and team showcase
- **Staff Page**: Professional team member profiles
- **Contact**: Contact form, business information, and Google Maps integration
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🗂️ Project Structure

```
manchy-automobile/
├── index.html              # Homepage
├── cars.html              # All cars listing page
├── car-details.html       # Individual car details
├── about.html             # About us page
├── staff.html             # Team members page
├── contact.html           # Contact page
├── image-updater.html     # Image management helper (admin tool)
├── UPDATE_IMAGES.sql      # SQL script for bulk image updates
│
├── public/
│   └── images/
│       ├── Background-Slideshow(1-4).jpeg  # Hero background images
│       ├── Manchy-Logo2962.PNG             # Company logo
│       ├── car-inventory/                  # 🚗 Car photos folder
│       │   ├── README.md                   # Instructions for car images
│       │   └── .gitkeep
│       └── staff-photos/                   # 👥 Staff photos folder
│           ├── README.md                   # Instructions for staff photos
│           └── .gitkeep
│
├── scripts/
│   ├── config.js          # Configuration (Supabase keys)
│   ├── supabase.js        # Supabase service functions
│   ├── main.js            # Global JavaScript utilities
│   ├── homepage.js        # Homepage functionality
│   ├── cars.js            # Cars page filtering/sorting
│   ├── car-details.js     # Car details & payment
│   └── staff.js           # Staff page functionality
│
├── styles/
│   ├── main.css           # Global styles
│   ├── homepage.css       # Homepage specific styles
│   ├── cars.css           # Cars page styles
│   ├── car-details.css    # Car details page styles
│   ├── about.css          # About page styles
│   ├── staff.css          # Staff page styles
│   └── contact.css        # Contact page styles
│
└── supabase/
    └── migrations/
        └── 20251023201215_create_manchy_automobile_schema.sql
```

## 📸 Image Management

### Quick Start for Updating Images

1. **For Car Photos**:
   - Place images in `public/images/car-inventory/`
   - Name format: `brand-model-year-1.jpg`
   - Update database with paths

2. **For Staff Photos**:
   - Place images in `public/images/staff-photos/`
   - Name format: `firstname-lastname.jpg`
   - Update database with paths

### Detailed Instructions

- Open `image-updater.html` in your browser for a visual guide
- Read `public/images/IMAGE_MANAGEMENT.md` for detailed instructions
- Use `UPDATE_IMAGES.sql` for bulk database updates
- Check individual folder README files for specific requirements

### Staff Photo File Names

| Staff Member | File Name |
|--------------|-----------|
| Emmanuel Adeyemi (CEO) | `emmanuel-adeyemi.jpg` |
| Adebayo Ogunleye (Operations Manager) | `adebayo-ogunleye.jpg` |
| Funmilayo Adeleke (Sales Manager) | `funmilayo-adeleke.jpg` |
| Chioma Okafor (Accountant) | `chioma-okafor.jpg` |
| Blessing Adekunle (PA to CEO) | `blessing-adekunle.jpg` |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd manchy-automobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Update `scripts/config.js` with your Supabase credentials
- Add your Paystack public key

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 🗄️ Database

### Supabase Tables

1. **cars** - Vehicle inventory
   - Brand, model, year, price, condition, transmission
   - Features (JSONB), images (JSONB)
   - Status tracking

2. **staff** - Team members
   - Name, role, email, bio
   - Photo URL, display order

3. **inquiries** - Customer inquiries
   - Customer details, inquiry type, message
   - Related car ID, status tracking

4. **transactions** - Payment records
   - Transaction details, Paystack reference
   - Payment status tracking

### Sample Data

The database includes:
- 14 sample cars (6 featured)
- 5 staff members
- Complete RLS policies

## 💳 Payment Integration

The website integrates Paystack for secure payment processing:

1. Update `scripts/config.js` with your Paystack public key
2. Payments are processed on car details pages
3. Transaction records are stored in the database
4. Success confirmations via WhatsApp integration

## 📱 Contact Information

- **Address**: New Akala Express Way, Beside Pinnacle Filling Station, New Garage, Ibadan
- **Phone**: 07076470444, 08055887437
- **Email**: manchyautomobile@gmail.com
- **Hours**: Monday-Saturday 9:00 AM - 6:00 PM
- **Social Media**:
  - Instagram: @manchy_automobile_ltd
  - TikTok: @manchy_autos

## 🎨 Design Theme

- **Primary Color**: Deep Black (#000000)
- **Accent Color**: Metallic Gold (#D4AF37)
- **Secondary Color**: White and Light Gray
- **Typography**: Poppins font family
- **Style**: Premium luxury aesthetic with minimal clutter

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Supabase (PostgreSQL)
- **Payment**: Paystack
- **Build Tool**: Vite
- **Hosting**: Ready for any static hosting service

## 📄 License

Copyright © 2025 Manchy Automobile Ltd. All rights reserved.

## 🆘 Support

For questions about:
- **Image Management**: Check `image-updater.html` or `IMAGE_MANAGEMENT.md`
- **Database Updates**: See `UPDATE_IMAGES.sql`
- **Technical Issues**: Contact your web developer

---


