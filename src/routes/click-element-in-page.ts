import { Router } from "express";
import { getPage } from "@managers/browser-manager";
import { generatePdf, deletePdf } from "@utils/pdf-utils";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { pageId, selector, optional } = req.body;
    const page = getPage(pageId);

    console.log("click-element-in-page, pageId=" + pageId + ", selector=" + selector + ", optional=" + optional);
    if (!page) return res.status(400).send("Page not found");

    deletePdf(pageId);
    await generatePdf(page, pageId);

    if (optional) {
      try {
        await page.click(selector);
      } catch (error) {
        console.debug(`Click on ${selector} failed, but it is optional`);
      }
    } else {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.click(selector),
      ]);
    }

    return res.send("Element clicked");
  } catch (error) {
    const response = "Error while cliking element. ";
    console.error(response + error);
    return res.status(500).send(response);
  }
});

export default router;
