
# Trinixity Hyper-Stream ⚡

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

**Trinixity Hyper-Stream** is a next-generation, cyberpunk-styled AI image generation interface. It utilizes a serverless architecture to securely interact with multiple top-tier AI models (Ideogram, Midjourney, DALL-E 3, SDXL) through a unified experience.

---

## 🌟 Features

*   **Multi-Model Support:** Switch seamlessly between Ideogram, Midjourney v6, DALL-E 3, SDXL Pro, and Meta AI.
*   **Futuristic UI:** Dark mode, glassmorphism effects, and cinematic animations.
*   **Secure Backend:** Built with Vercel Serverless Functions (Node.js) to keep API keys hidden from the client side.
*   **Smart History:** Automatically saves your generation history locally so you never lose a creation.
*   **Responsive Design:** Fully optimized for desktop, tablet, and mobile (9:16) layouts.
*   **Advanced Options:** Customize aspect ratios (16:9, 1:1, 9:16) and artistic styles (Realism, Anime, Cinema).

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3 (Variables, Flexbox, Animations), Vanilla JavaScript (ES6+).
*   **Backend:** Node.js (Vercel Serverless Functions).
*   **Deployment:** Vercel.
*   **API:** Paxsenix AI API.

---

## 📂 Project Structure

```text
trinixity-hyperstream/
├── api/
│   └── generate.js       # Serverless function (Hides API Key)
├── index.html            # Main UI Skeleton
├── style.css             # Cyberpunk/Glassmorphism Styling
├── script.js             # Frontend Logic & State Management
└── README.md             # Documentation
🚀 Getting Started (Local Development)

To run this project locally, you need to simulate the Serverless environment. The easiest way is using the Vercel CLI.

Clone the repository

code
Bash
download
content_copy
expand_less
git clone https://github.com/thrynnex/trinixity-hyperstream.git
cd trinixity-hyperstream

Install Vercel CLI (Global)

code
Bash
download
content_copy
expand_less
npm i -g vercel

Run Locally

code
Bash
download
content_copy
expand_less
vercel dev

Follow the prompts to link to your Vercel account. This sets up a local server at localhost:3000 that supports the /api route.

🌍 Deployment

This project is optimized for Vercel.

Push your code to GitHub.

Go to Vercel and "Import Project" from GitHub.

Crucial Step: In the Project Settings during import (or under Settings > Environment Variables), add your API key:

Variable Name	Value
PAXSENIX_API_KEY	sk-paxsenix-xxxxxxxx...

Click Deploy.

⚙️ Configuration
Supported Models

The interface currently supports mapping to the following endpoints:

ideogram

midjourney

dalle

sdxl

metaai

Environment Variables

For security, the frontend never touches the API key. Ensure PAXSENIX_API_KEY is set in your server environment.

🤝 Contributing

Contributions are welcome!

Fork the Project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your Changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.
