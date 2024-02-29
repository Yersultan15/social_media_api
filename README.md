# Instagram & TikTok API

## Overview

This API provides functionalities related to Instagram, TikTok, a quiz feature, and the ability to post items resembling Instagram posts.

## Setting Up the Project


1. **Navigate to the 'src' directory:**

   ```bash
   cd src


2. Install the required dependencies:


```bash

   npm install express express-session axios path

````
3. Run the Node.js server:

```bash

node index.js
```


This will start the server, and you can now access the API endpoints as described below.
### APIs


- **Instagram API:** [Robigram API](https://rapidapi.com/kuroyama0192/api/robigram)
- **TikTok API:** [TikWatermark API](https://rapidapi.com/badimohammed2019/api/tikwatermark)

## Instagram

### `GET /instagram`

This route renders the Instagram page where users can enter an Instagram username to fetch user information.

- **Endpoint:** `/instagram`
- **Method:** `GET`
- **Usage:**
  - Visit `/instagram` to access the Instagram page.
  - Enter an Instagram username in the provided form and click "Get Instagram Info" to fetch user details.

### `POST /get-instagram-info`

This route handles the form submission from the Instagram page, fetching information about the provided Instagram username.

- **Endpoint:** `/get-instagram-info`
- **Method:** `POST`
- **Usage:**
  - Form submission from the Instagram page.
  - Retrieves details such as User ID, username, privacy status, full name, biography, external URL, and verification status.

#### Instagram User Information:

- **User ID:** The unique identifier for the Instagram user.
- **Username:** The username of the Instagram account.
- **Is Private:** Indicates whether the account is set to private (true/false).
- **Full Name:** The full name associated with the Instagram account.
- **User Biography:** A brief description or bio provided by the user.
- **External URL:** The external URL specified in the user's profile.
- **Is Verified:** Indicates whether the account has been verified by Instagram (true/false).

## Example Input Link:
{
"username (instagram)": "astana_it_students",
}
## TikTok

### `GET /tiktok`

This route renders the TikTok page where users can enter a TikTok video link to fetch video information.

- **Endpoint:** `/tiktok`
- **Method:** `GET`
- **Usage:**
  - Visit `/tiktok` to access the TikTok page.
  - Enter a TikTok video link in the provided form and click "Get TikTok Video Info" to fetch video details.

### `POST /download-tiktok-video`

This route handles the form submission from the TikTok page, fetching information about the provided TikTok video link, and providing an option to download the video without a watermark.

- **Endpoint:** `/download-tiktok-video`
- **Method:** `POST`
- **Usage:**
  - Form submission from the TikTok page.
  - Removes TikTok watermark from videos by giving the TikTok link.

#### TikTok Video Information:

- **Video URL:** The original URL of the TikTok video.
- **Download Link (Without Watermark):** Provides a link to download the TikTok video without the watermark.
## Example Input Link:
{
  "videoURL": "https://vm.tiktok.com/ZMMLFdpQU/",
}


## Admin Panel

The admin panel allows the administrator to manage users and posts.

### Admin Login

- **Username:** ersik
- **Password:** 12345678
- 
## Bonus Quiz

### `GET /quiz/start`

This route renders the Quiz Start page where users can participate in a quiz related to Instagram.

- **Endpoint:** `/quiz/start`
- **Method:** `GET`
- **Usage:**
   - Visit `/quiz/start` to access the Quiz Start page.
   - Answer the quiz questions and submit the form.

### `POST /quiz_start`

This route handles the form submission from the Quiz Start page, calculates the quiz score, and displays the result.

- **Endpoint:** `/quiz_start`
- **Method:** `POST`
- **Usage:**
   - Form submission from the Quiz Start page.

## Post Instagram

### `GET /itemsList`

This route renders the Post Instagram page where users can create and post items similar to Instagram posts.

- **Endpoint:** `/itemsList`
- **Method:** `GET`
- **Usage:**
   - Visit `/itemsList` to access the Post Instagram page.
   - Fill out the form to add a new item and click "Add Item" to post.
   - You can choose three photos by clicking Ctrl + The photo

### `POST /items`

This route handles the form submission from the Post Instagram page, allowing users to post items with a title, description, and images.

- **Endpoint:** `/items`
- **Method:** `POST`
- **Usage:**
   - Form submission from the Post Instagram page.

## Additional Notes

- The application includes language localization with options to choose between English, Russian, and Kazakh.
- User authentication is implemented with a login/logout mechanism.

Feel free to explore and enjoy the functionalities provided by this Instagram & TikTok API!
