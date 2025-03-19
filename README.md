
---

# **Mini Blogs – Publish, Earn Points, and Own Your Content**  

## **Overview**  
Mini Blogs is a decentralized blogging platform where users can **write and publish blogs**, earning points that will later be converted into **Mini Blogs Token (MBT)**. The platform ensures content ownership by storing blogs on **IPFS** and minting them to users' wallets.  

🚀 **Key Features:**  
✅ **Publish Blogs & Earn Points** – Write blogs and accumulate points that will be converted to **MBT tokens** in the future.  
✅ **IPFS Storage & Minting** – Blogs are stored on **IPFS** and minted to your wallet, ensuring decentralized ownership.  
✅ **Telegram Mini App Integration** – Read blogs seamlessly within Telegram through a lightweight Mini App.  
✅ **AI Integration (Coming Soon)** – In the future, AI will help analyze and categorize content to distinguish between user-generated and AI-generated blogs.  

---

## **Getting Started**  

Follow these steps to set up and run the project locally.  

### **1️⃣ Clone the Repository**  
Use Git to clone the repository:  

```sh
git clone git@github.com:FadhilMulinya/miini-blogs.git
cd miini-blogs
```

### **2️⃣ Configure Environment Variables**  
Copy the example environment file and configure it with your **Pinata** credentials:  

```sh
cp .env.local .env
```

- Obtain the **Gateway URL** and **JWT Token** from Pinata:  
  📌 [Pinata Next.js Guide](https://docs.pinata.cloud/frameworks/next-js)  

### **3️⃣ Install Dependencies**  
Install the required packages using your preferred package manager:  

```sh
npm install      # Using npm
pnpm install     # Using pnpm
yarn install     # Using yarn
bun install      # Using Bun
```

### **4️⃣ Start the Development Server**  
Run the project with hot-reloading for instant preview:  

```sh
npm run dev      # Using npm
pnpm dev        # Using pnpm
yarn dev        # Using yarn
bun dev         # Using Bun
```

---

## **Telegram Mini App Integration**  

Mini Blogs is also available as a **Telegram Mini App**, allowing users to read blogs directly within Telegram.  

### **How to Access the Mini App**  
1. Open **Telegram**  
2. Search for **Mini Blogs** or use the provided link (TBA)  
3. Click **"Start"** and explore blogs instantly  

This feature provides a **fast and convenient** way to access blogs without leaving Telegram.  

---

## **How Mini Blogs Works**  

1️⃣ **Write & Publish** – Users create blogs, which are stored on **IPFS**.  
2️⃣ **Minting & Ownership** – Once published, the blog is **minted to the user's wallet**.  
3️⃣ **Earn MBT Tokens** – Users accumulate **points** for published blogs, which will be converted into **Mini Blogs Token (MBT)**.  

🚀 **Future Plans:**  
- **AI-Powered Content Filtering** – AI will help analyze content to ensure quality and categorize **user-generated vs. AI-generated** content.  
- **Referral Program** – Users will be able to refer others and earn additional rewards.  

---

## **Technologies Used**  

This project is built with:  

- **Vite** – Fast frontend tooling  
- **TypeScript** – Typed JavaScript for reliability  
- **React** – Component-based UI  
- **shadcn-ui** – Modern UI components  
- **Tailwind CSS** – Utility-first styling  
- **IPFS** – Decentralized storage for blogs  
- **Blockchain & Wallet Integration** – To ensure content ownership  

---

## **Deployment Guide**  

### **1️⃣ Push the Code to GitHub**  
Ensure your latest changes are pushed to GitHub:  

```sh
git add .
git commit -m "Initial commit"
git push origin main
```

### **2️⃣ Deploy to Vercel**  
1. Go to [Vercel](https://vercel.com/) and log in.  
2. Click **"New Project"** and import the GitHub repository.  
3. Add your environment variables in Vercel settings.  
4. Click **"Deploy"** and wait for the build to complete.  

Once deployed, your project will be live on a custom Vercel URL. 🎉  

---

## **Contributing**  

We welcome contributions! If you’d like to improve Mini Blogs:  
- Fork the repository  
- Create a feature branch (`git checkout -b feature-name`)  
- Commit your changes (`git commit -m "Add new feature"`)  
- Push to your branch and open a pull request  

---

## **License**  
This project is open-source and licensed under the [MIT License](LICENSE).  

---
