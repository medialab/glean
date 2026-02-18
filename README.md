## Design Team Portfolio – Sciences Po médialab

This repository hosts the portfolio of the **design team inside Sciences Po’s médialab**.  
It is meant not to separate our work from the rest of the lab, but to provide a **shared visual space** where projects initiated within the design team can be explored by both internal and external audiences.

## Purpose

- **Document projects**: keep track of the visual, interactive, and editorial outputs produced by the design team.
- **Share with others**: offer a clear entry point for colleagues, partners, and students who want to discover what the team works on.
- **Support collaboration**: make it easier to reference past projects when starting new ones.

## How to Contribute

For **design team members**:

1. **Go to the media folder**  
   Navigate to the [lib media folder](https://github.com/medialab/glean/tree/975f89f22b57ff6f78b645d0b841ecc8f586f088/src/lib/media).

2. **Create a project folder (if needed)**  
   If not yet present, create a folder named with the project’s **5-digit TAG**. (you're supposed to choose a 5 digit tag in that case)

3. **Upload your media files**  
   Add all the media assets for the project. We currently support:
   - `.png`
   - `.jpg`
   - `.webp`
   - `.avif`
   - `.mp4`
   - `.mov`
   - `.pdf`
     All supported media files in the folder will be processed automatically.

4. **Declare the project in `main.yaml`**  
   Edit [`main.yaml`](https://medialab.github.io/glean/blob/main/src/lib/dataset/main.yaml) and, if needed, add a new entry following this structure:

   ```yaml
   - title: 'Title of your project'
     description: 'Description of your project'
     link: 'https://website.url'
     tag: '5DIGIT_TAG_HERE'
     year_begin: 'YYYY'
     year_end: 'YYYY'
     team_people: 'Name Surname (1), Name Surname (2), ...'
   ```

5. **Keep TAG and folder in sync**  
   The **`tag` value in `main.yaml` and the folder name must be identical**.

6. **Open a pull request**  
   Submit a pull request with your changes so the portfolio can be updated and reviewed.
