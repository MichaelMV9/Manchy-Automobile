# Staff Photos

Place staff member photos in this folder for easy management.

## Naming Convention

Use the following naming format for consistency:
- `firstname-lastname.jpg`

Examples:
- `emmanuel-adeyemi.jpg` (CEO)
- `adebayo-ogunleye.jpg` (Operations Manager)
- `funmilayo-adeleke.jpg` (Sales Manager)
- `chioma-okafor.jpg` (Accountant)
- `blessing-adekunle.jpg` (Personal Assistant)

## Image Requirements

- **Format**: JPG or PNG
- **Recommended Size**: 800x800 pixels (square/portrait)
- **Orientation**: Portrait or headshot
- **Max File Size**: 1MB per image
- **Quality**: Professional quality, clear face visibility
- **Background**: Clean, professional background preferred

## Usage

After adding photos to this folder, update the staff record in the database with the photo path:

```javascript
photo_url: "images/staff-photos/firstname-lastname.jpg"
```

## Current Staff

1. Emmanuel Adeyemi - CEO
2. Adebayo Ogunleye - Operations Manager
3. Funmilayo Adeleke - Sales Manager
4. Chioma Okafor - Accountant
5. Blessing Adekunle - Personal Assistant to CEO

## Instructions

1. Take professional headshots of all staff members
2. Save them in this folder using the naming convention above
3. Update the database `staff` table with the correct `photo_url` paths
4. The website will automatically display the photos on the Staff page

If no photo is provided, the system will display initials as a fallback.
