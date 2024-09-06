# Puppeteer Server with Express

This project is a TypeScript-based server application built with Express, allowing you to send HTTP requests that trigger specific actions in Puppeteer. The server is highly configurable via environment variables.

## Installation
To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/puppeteer-server.git
cd puppeteer-server
npm install
```
Compile the TypeScript files into JavaScript and start server by:
```bash
npm run build-and-start
```

## Environment Variables
The behavior of the server can be configured using environment variables defined in the .env file.
 - PORT: The port on which the server will listen (default: 3000).
 - ALLOWED_IPS: A comma-separated list of IPs that are allowed to access the server (default: ::1,::ffff:127.0.0.1).
 - PUPPETEER_HEADLESS: Determines if Puppeteer runs in headless mode (true or false, default: false).
 - PDF_PATH: The path where generated PDFs will be saved (default: ./pdf/).

 Example .env file:
```bash
PORT=3000
ALLOWED_IPS=::1,::ffff:127.0.0.1
PUPPETEER_HEADLESS=false
PDF_PATH=./pdf/
```

## Testing
To run the test suite, simply execute:
```bash
npm test
```

## Formatting
To format the codebase using Prettier, run the following command:
```bash
npx prettier src --write
```

## Available Actions

### 1. Start Browser

**Endpoint**: `/start-browser`  
**Method**: `GET`

This action starts the Puppeteer browser.

**Response**:

Returns string 'Browser started'

### 2. Open URL in New Page

**Endpoint**: `/open-url-in-new-page`  
**Method**: `POST`

This action opens a new tab in the browser and navigates to the specified URL.

**Request Body**:
```json
{
  "url": "https://example.com"
}
```

**Response**:

Returns the pageId of the newly opened tab.

### 3. Open URL in Existing Page

**Endpoint**: `/open-url-in-existing-page`  
**Method**: `POST`

This action navigates to a specified URL in an existing tab. Before navigating, a PDF of the current view in the tab is generated, and any existing PDF for this tab is deleted.

**Request Body**:
```json
{
  "pageId": "123",
  "url": "https://example.com"
}
```

**Response**:

Returns the status from Puppeteer.


### 4. Get Page Content

**Endpoint**: `/get-page-content`  
**Method**: `GET`

This action generates a PDF of the current view of the specified tab and returns the HTML content of that page.

**Request Body**:
```json
{
  "pageId": "123",
}
```

**Response**:

Returns the HTML content of the page.


### 5. Click Element in Page

**Endpoint**: `/click-element-in-page`  
**Method**: `POST`

This action clicks a specified element on a given tab. If the element is optional and not found, no error is returned. Before attempting the click, a PDF of the current view in the tab is generated, and any existing PDF for this tab is deleted.

**Request Body**:
```json
{
  "pageId": "123",
  "selector": "#button",
  "optional": true
}
```

**Response**:

Returns string 'Element clicked'

### 6. Close Browser

**Endpoint**: `/close-browser`  
**Method**: `DELETE`

This action clicks a specified element on a given tab. If the element is optional and not found, no error is returned. Before attempting the click, a PDF of the current view in the tab is generated, and any existing PDF for this tab is deleted.

**Request Body**:
```json
{
  "pageId": "123",
  "selector": "#button",
  "optional": true
}
```

**Response**:

Returns string 'Element clicked'

### 7. Close Page

**Endpoint**: `/close-page`  
**Method**: `DELETE`

This action closes a specific tab in the browser.

**Request Body**:
```json
{
  "pageId": "123"
}
```

**Response**:

Returns string 'Page closed'

### 8. Go Back in Page
**Endpoint**: `/go-back-in-page`  
**Method**: `POST`

This action navigates back to the previous page in a given tab. Before going back, a PDF of the current view in the tab is generated, and any existing PDF for this tab is deleted.

**Request Body**:
```json
{
  "pageId": "123"
}
```

**Response**:

Returns string 'Go back clicked'

### 9. Type in text
**Endpoint**: `/type-in-page`  
**Method**: `PUT`

This action takes a string from the request and places it in a specified element on a given tab

**Request Body**:
```json
{
  "pageId": 123, 
  "text": "some text",
  "selector": "#button" 
}
```

**Response**:

Returns string 'Text entered'

## Troubleshooting
 -if you have problem with failing tests, please first delete `/dist`






