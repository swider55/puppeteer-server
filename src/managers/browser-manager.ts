import puppeteer, { Browser, Page } from "puppeteer";

let _browser: Browser | null = null;
const _pages: { [key: string]: Page } = {};

export async function startBrowser(): Promise<Browser> {
  if (!_browser) {
    const ifHeadless = process.env.PUPPETEER_HEADLESS === "true";
    _browser = await puppeteer.launch({ 
      headless: ifHeadless,
      // uncomment below settings if using Docker
      // defaultViewport: null,
      // executablePath: '/usr/bin/google-chrome',
      // args: ['--no-sandbox'],
    });
  }
  return _browser;
}

export function getBrowser(): Browser | null {
  return _browser;
}

export async function closeBrowser(): Promise<void> {
  if (_browser) {
    await _browser.close();
    _browser = null;
  }
}

export function setNewPage(id: string, page: Page): void {
  _pages[id] = page;
}

export function getPage(id: string): Page {
  return _pages[id];
}

export function deletePage(id: string): void {
  delete _pages[id];
}
