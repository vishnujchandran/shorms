<a id="readme-top"></a>

<h3 align="center">Shorms - Shadcn Forms Builder</h3>

<p align="center">
  Multi-Page Form Builder for Shadcn/ui & React Hook Form
  <br />
  Build, preview, and export production-ready forms locally
</p>

## Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## About The Project

**Shorms** is a local-first form builder built on [shadcn/ui](https://ui.shadcn.com) and [React Hook Form](https://www.react-hook-form.com/). It focuses on rapid form development with multi-page support, advanced validation, and instant code generation.

Everything runs locally - no database, no backend, no deployment needed. Build your forms, export them as JSON or React components, and use them in your projects.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

- ✅ **Multi-Page Support** - Create complex wizards and multi-step forms
- ✅ **Advanced Validation** - Configure regex patterns, min/max length, min/max values, required fields, and custom error messages
- ✅ **File Upload** - Support file uploads with size validation (max MB limits)
- ✅ **Live Preview** - Test your form logic instantly with the built-in Form Runner
- ✅ **Code Generation** - Export production-ready React code with Zod validation and react-hook-form
- ✅ **JSON Import/Export** - Save and restore form schemas locally
- ✅ **Drag-and-Drop** - Reorder fields and pages with intuitive drag-and-drop
- ✅ **Example Forms** - Ready-to-use templates for common form types (contact, registration, surveys)
- ✅ **LLM Integration** - Comprehensive guide for AI agents to integrate Shorms into projects
- ✅ **Local State** - All data persists in localStorage, no backend required

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

1. Clone the repository

   ```sh
   git clone https://github.com/yourusername/shorms
   ```

2. Navigate to project directory

   ```sh
   cd shorms
   ```

3. Install dependencies

   ```sh
   npm install --legacy-peer-deps
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Start the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Workflow

1. **Build** - Drag fields from the sidebar to create your form
2. **Configure** - Click fields to set validation rules and properties
3. **Preview** - Test the form with the Preview button
4. **Export** - Download as JSON or copy the generated React code
5. **Import** - Restore forms from previously exported JSON files

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

### Completed
- [x] Multi-Page / Wizard Form Support
- [x] Advanced Validation (Regex, Min/Max Length, Min/Max Values, Custom Messages)
- [x] JSON Import / Export
- [x] Live Form Preview (Runner)
- [x] Code Generation with Multi-Page Support
- [x] Drag-and-drop page reordering
- [x] File upload field with size validation
- [x] Example form templates
- [x] LLM integration documentation
- [x] Unique field ID generation (nanoid)

### Planned
- [ ] Undo/Redo functionality
- [ ] Additional field types:
  - [ ] OTP input
  - [ ] Multi select
  - [ ] Phone input
- [ ] Conditional field logic (show/hide based on other fields)
- [ ] Form templates library
- [ ] Theme customization for generated forms
- [ ] Dark mode improvements

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://www.react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [dnd-kit](https://dndkit.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
