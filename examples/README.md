# Shorms Example Forms

This directory contains sample form schemas that demonstrate various features and use cases of Shorms.

## How to Use

1. Start the Shorms Builder application
2. Click the "Import" button in the header
3. Select one of the example JSON files from this directory
4. The form will be loaded automatically into the builder
5. You can then preview, edit, or export the form

## Available Examples

### 1. Contact Form (`contact-form.json`)

**Use Case:** Basic single-page contact form for websites

**Features Demonstrated:**
- Single-page form layout
- Text input with validation (min/max length)
- Email field with validation
- Select dropdown
- Textarea with character limits
- Checkbox for opt-in

**Fields:**
- Full Name (required, 2-100 characters)
- Email Address (required, valid email format)
- Subject (required, dropdown selection)
- Message (required, 10-1000 characters)
- Subscribe to Newsletter (optional checkbox)

---

### 2. User Registration (`user-registration.json`)

**Use Case:** Multi-page user registration wizard

**Features Demonstrated:**
- Multi-page form with logical grouping
- Page navigation
- Various validation rules (regex, min/max length)
- Different input types (text, email, date, radio, switch)
- Default values

**Pages:**
1. **Personal Info**
   - First Name & Last Name (required, 2-50 characters)
   - Date of Birth (required)
   - Phone Number (regex validation for phone format)

2. **Account Details**
   - Username (required, 3-20 characters, alphanumeric + underscore only)
   - Email (required, valid email format)
   - Password (required, minimum 8 characters)

3. **Preferences**
   - Enable Notifications (switch with default value)
   - Theme Preference (radio group)
   - Primary Interest (combobox)
   - Accept Terms (required checkbox)

---

### 3. Feedback Survey (`feedback-survey.json`)

**Use Case:** Customer feedback and satisfaction survey

**Features Demonstrated:**
- Multi-page survey structure
- Slider inputs for ratings
- Number inputs with min/max validation
- File upload with size limits
- Mix of required and optional fields
- Text areas with character limits

**Pages:**
1. **Basic Information**
   - Respondent Name (required)
   - Email Address (required)
   - Customer Type (dropdown selection)

2. **Rate Your Experience**
   - Overall Satisfaction (slider 0-10, required)
   - Product Quality (slider 0-10)
   - Customer Service (slider 0-10)
   - Value for Money (number input 1-5, required)

3. **Detailed Feedback**
   - What did you like most? (textarea, 10-500 chars)
   - What could be improved? (textarea, 10-500 chars)
   - Would you recommend us? (radio group, required)
   - Upload Screenshot (file upload, max 5MB, optional)
   - Allow follow-up contact (switch)

---

## Validation Features Showcased

These examples demonstrate various validation capabilities:

- **Required Fields**: Mark fields as mandatory
- **Text Length**: Min/max character limits for text inputs
- **Number Range**: Min/max values for numeric inputs
- **Email Validation**: Built-in email format validation
- **Regex Patterns**: Custom regex validation (phone numbers, usernames)
- **File Size Limits**: Maximum file size for uploads (in MB)
- **Custom Error Messages**: Override default validation messages

## Field Types Covered

All examples together cover these field types:

- `INPUT` - Single-line text input
- `TEXTAREA` - Multi-line text input
- `EMAIL` - Email input with validation
- `NUMBER_INPUT` - Numeric input
- `SELECT` - Dropdown selection
- `RADIO_GROUP` - Radio button group
- `CHECKBOX` - Single checkbox
- `SWITCH` - Toggle switch
- `SLIDER` - Range slider
- `COMBOBOX` - Searchable dropdown
- `DATE` - Date picker
- `FILE_UPLOAD` - File upload with size validation

## Customization Tips

You can use these examples as starting points and modify them:

1. **Change Labels & Descriptions**: Update text to match your use case
2. **Add/Remove Fields**: Edit the `fields` array in any page
3. **Adjust Validation**: Modify the `validation` object for each field
4. **Rename Pages**: Update the `title` property of each page
5. **Reorder Pages**: Change the order of pages in the array
6. **Change Field Types**: Replace field types while keeping the structure

## Integration Guide

After importing and customizing an example:

1. **Preview**: Click "Preview" to test the form behavior
2. **Export JSON**: Download the schema for use in your application
3. **Generate Code**: Copy the generated React component code
4. **Integrate**: Use the form in your Next.js/React project

## Notes

- The `Icon` property is empty in JSON exports (icons are assigned in the builder)
- `registryDependencies` indicate which shadcn/ui components are needed
- All validation is enforced using Zod schemas
- Forms persist in localStorage when using the builder
