# Glean

[![Deploy to GitHub Pages](https://github.com/medialab/glean/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/medialab/glean/actions/workflows/deploy.yml)

A shared visual space for projects by the médialab design team.

<img width="5088" height="3344" alt="image" src="https://github.com/user-attachments/assets/c4876040-f646-4685-8e11-833c5681c9a6" />

## How to Add a Project

All projects live inside [`src/lib/projects/`](https://github.com/medialab/glean/tree/d8302bd51b8f01696009953a84e33e25b212859d/src/lib/projects).

Each project gets its own folder, named after it:

```text
src/lib/projects/PROJECT_NAME/
```

---

### Step 1: Prepare your project's folder

Collect all media you want to display in your project.
Glean currently supports:

```text
Images: PNG, JPG, JPEG, WEBP, GIF, AVIF, SVG
Videos: MP4, MOV
Documents: PDF
```

At least one image should be named `thumb` to display a thumbnail in the project's card.

The folder should follow a likely structure:

```text
PROJECT_NAME/
├── thumb.jpg
├── image_1.jpg
├── image_2.jpg
├── demo_video.mp4
├── report.pdf
├── SUBFOLDER
└── ...pdf
```

> [!NOTE]
> If in the folder there's a subfolder with images, it will create in the project page a mosaic.
> If there's a PDF in the folder, it will be displayed automatically with a PDF reader in the project page to navigate it.

---

### Step 2: Upload the project

You have two ways to do this. 

#### Option A: Use GitHub's interface

1. Go to [`src/lib/projects/`](https://github.com/medialab/glean/tree/d8302bd51b8f01696009953a84e33e25b212859d/src/lib/projects).
2. Click **Add file** and then **Upload files**
3. Upload your **folder**
4. Add a short commit message describing the project you added
5. Commit the changes to `main`

> [!NOTE]
> You do not need to create/upload `project.yaml` or other files but your folder.

> [!TIP]
> When Glean detects a new project folder, the automation creates it for you using [`scripts/bootstrap-project.ts`](https://github.com/medialab/glean/blob/d8302bd51b8f01696009953a84e33e25b212859d/scripts/bootstrap-project.ts).

#### Option B: Use your computer

### Option B: Use your computer

1. Clone the repository:

```bash
git clone https://github.com/medialab/glean.git
cd glean
```

2. Install Bun if you haven't got it:

```bash
curl -fsSL https://bun.sh/install | bash
```

3. Install the project deps and create a new project:

```bash
bun i && bun scripts/create-project.ts MYPROJECT "My Project"
```

5. Add your media files **inside the new project folder**.

6. Preview the website locally:

```bash
bun run dev
```

7. Commit and push your changes:

```bash
git add .
git commit -m "add MYPROJECT project"
git push origin main
```

---

### Step 3: Wait for automation

> [!NOTE]
> Every push to `main` triggers Glean's automatic workflows.

For a new project, the system:

1. Detects the new project folder.
2. Creates `project.yaml` if it does not exist.
3. Moves videos into `_videos/`.
4. Moves PDFs into `_documents/`.
5. Detects all project media.
6. Adds the media to `media_captions` inside `project.yaml`.
7. Generates the dithered thumbnail used by the interface.
8. Builds the website.
9. Publishes the updated portfolio to GitHub Pages.

Project bootstrapping and media synchronisation are handled by [`sync-media.yml`](https://github.com/medialab/glean/blob/d8302bd51b8f01696009953a84e33e25b212859d/.github/workflows/sync-media.yml).

The website build and deployment are handled by [`deploy.yml`](https://github.com/medialab/glean/blob/d8302bd51b8f01696009953a84e33e25b212859d/.github/workflows/deploy.yml).

You can follow running and completed workflows from the [GitHub Actions page](https://github.com/medialab/glean/actions).

---

### Step 4: Edit the project information

After the first automation has completed, open the generated `project.yaml` inside your project folder.
The `project.yaml` is the source of all the visible textual data of your project.

For example: [`EL2MP/project.yaml`](https://github.com/medialab/glean/blob/d8302bd51b8f01696009953a84e33e25b212859d/src/lib/projects/EL2MP/project.yaml).

You can edit it by rewriting values, don't change parameters names or you'll encounter build errors:

```yaml
title: 'My Project'
description: 'A short description of the project.'
link: 'https://example.com'
tag: MYPROJECT
year_begin: '2026'
year_end: '2027'
project_type: Research
team_people: Person One, Person Two
```

> [!NOTE]
> Not all parameters are mandatory.
> The `tag` parameter must be **identical** to the project folder name.

---

### Step 5: Edit captions

Glean stores media captions directly inside each project's `project.yaml`. Everything's automatically created based on the uploaded media files.

You can then fill them in, or leave them blank:

```yaml
media_captions:
  thumb.jpg: 'Project overview'
  interface.jpg: 'First prototype of the interface'
  workshop.jpg: 'Participatory workshop at the médialab'
  _videos/demo.mp4: 'Demonstration of the final prototype'
  _documents/report.pdf: 'Final research report'
```

> [!NOTE]
> When a media file is added or removed, the automation synchronizes this list.

---

## Editing an Existing Project

To update an existing project, open it inside [`src/lib/projects/`](https://github.com/medialab/glean/tree/d8302bd51b8f01696009953a84e33e25b212859d/src/lib/projects).

You can:

1. Edit `project.yaml`.
2. Upload new images.
3. Upload videos.
4. Upload PDFs.
5. Replace the thumbnail.
6. Edit media captions.
7. Remove obsolete files.

Commit the changes to `main`.

> [!NOTE]
> Glean will rebuild and redeploy automatically.

## Local Development

Glean is built with SvelteKit, Svelte 5, TypeScript, Tailwind CSS and Bun.

The available commands are defined in [`package.json`](https://github.com/medialab/glean/blob/d8302bd51b8f01696009953a84e33e25b212859d/package.json).

## Useful Commands

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the local development server |
| `bun run validate` | Validate every project and its metadata |
| `bun run bootstrap` | Create missing `project.yaml` files and organise project media |
| `bun run imgYmlCreator` | Synchronise `media_captions` with project media |
| `bun run dither` | Generate dithered thumbnails |
| `bun run dither:check` | Validate generated dithered thumbnails |
| `bun run dither:all` | Generate and validate all dithered thumbnails |
| `bun run build` | Run the complete production build |
| `bun run check` | Run Svelte type checking |

Project validation is implemented in [`scripts/validate-projects.ts`](https://github.com/medialab/glean/blob/d8302bd51b8f01696009953a84e33e25b212859d/scripts/validate-projects.ts).
