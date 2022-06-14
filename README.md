# A statically generated blog example using Next.js, Cosmic, and Cosmic Merge preview capabilities

This example showcases Next.js's [Static Generation](https://nextjs.org/docs/basic-features/pages) feature using [Cosmic](https://cosmicjs.com/) as the data source.

Includes [Cosmic merge request](https://www.cosmicjs.com/blog/introducing-merge-requests) preview giving you the ability to do bulk updates between Buckets, see bulk update previews, get approvals from other team members, and more.


## Demo

[https://cosmic-next-blog.vercel.app/](https://cosmic-next-blog.vercel.app/)

## Deploy your own

Once you have access to [the environment variables you'll need](#step-3-set-up-environment-variables), deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git?c=1&s=https://github.com/cosmicjs/next-merge&env=COSMIC_BUCKET_SLUG,COSMIC_READ_KEY,COSMIC_PREVIEW_SECRET&envDescription=Required%20to%20connect%20the%20app%20with%20Cosmic&envLink=https://vercel.link/cms-cosmic-env)

## What is Cosmic Merge Requests?
Cosmic Merge Requests is a feature in the [Cosmic headless CMS](https://www.cosmicjs.com/features) that enables you to do bulk edits, preview, and approval workflows for content updates. Learn more about merge requests in the [Cosmic blog announcement](https://www.cosmicjs.com/blog/introducing-merge-requests).

Uses [SWR](https://swr.vercel.app/) for instant previews on content updates in preview mode.


## How to use

Clone the repo to install and bootstrap the example:

```bash
git clone https://github.com/cosmicjs/next-merge
```

## Configuration

### Step 1. Create an account and a project on Cosmic

First, [create an account on Cosmic](https://cosmicjs.com).

### Step 2. Install the Next.js Merge Blog

After creating an account, install the [Next.js Merge Blog](https://www.cosmicjs.com/apps/nextjs-merge-blog) app from the Cosmic App Marketplace.

### Step 3. Set up environment variables

Go to the **Settings** menu at the sidebar and click **Basic Settings**.

Next, copy the `.env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Then set each variable on `.env.local`:

- `COSMIC_BUCKET_SLUG` should be the **Bucket slug** key under **Basic Settings**.
- `COSMIC_READ_KEY` should be the **Read Key** under **API Access**.
- `COSMIC_PREVIEW_SECRET` can be any random string (but avoid spaces) - this is used for [Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode).

Your `.env.local` file should look like this:

```bash
COSMIC_BUCKET_SLUG=...
COSMIC_READ_KEY=...
COSMIC_PREVIEW_SECRET=...
```

### Step 4. Run Next.js in development mode

```bash
npm install
npm run dev

# or

yarn install
yarn dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)! If it doesn't work, post on [GitHub discussions](https://github.com/vercel/next.js/discussions).

### Step 5. Try Merge preview mode

To add the ability to preview content from a merge request, follow these steps:

1. To clone a Bucket into your Project, go to <i>Your Bucket > Basic Settings</i>, scroll down, and click "Clone Bucket".
2. After cloning your Bucket, create a new merge request in your Bucket project clicking the "Add Merge Request" button on the Dasboard
3. Select the Source Bucket (Staging) and your Target Bucket (Production). Click "Review Changes".
4. There shouldn't be any changes to preview yet. Now add your merge Preview Link exactly the following and click "Save":
```
http://localhost:3000?merge_id=[merge_id]
```
The `[merge_id]` shortcode will be converted into the merge request id which will be used to get the Objects in the merge request.

4. Add / Edit content in your Staging Bucket. Any edits to Objects, Object Types, and Media will be added to the merge request (deleting content does not affect it).
5. After adding and editing content in staging, go back to your merge request and notice the Changes to Objects, Object Types, and / or Media.
6. Click the "Preview" button to see content from the merge request now visible in your locally running app.
7. Make more changes in your Staging Bucket and see real time updates in the app thanks to [SWR](https://swr.vercel.app/) :)

To exit preview mode, you can click on **You are previewing merge content. Click here to remove** at the top.

### Step 6. Deploy on Vercel

You can deploy this app to the cloud with [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-merge-example) ([Documentation](https://nextjs.org/docs/deployment)).

#### Deploy Your Local Project

To deploy your local project to Vercel, push it to GitHub/GitLab/Bitbucket and [import to Vercel](https://vercel.com/import/git?utm_source=github&utm_medium=readme&utm_campaign=next-merge-example).

**Important**: When you import your project on Vercel, make sure to click on **Environment Variables** and set them to match your `.env.local` file.

#### Deploy from Our Template

Alternatively, you can deploy using this template by clicking on the Deploy button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git?c=1&s=https://github.com/cosmicjs/next-merge&env=COSMIC_BUCKET_SLUG,COSMIC_READ_KEY,COSMIC_PREVIEW_SECRET&envDescription=Required%20to%20connect%20the%20app%20with%20Cosmic&envLink=https://vercel.link/cms-cosmic-env)
