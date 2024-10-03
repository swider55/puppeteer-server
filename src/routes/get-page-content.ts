import { Router } from "express";
import { getPage } from "@managers/browser-manager";
import { generatePdf } from "@utils/pdf-utils";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pageId = req.query.pageId as string;
    const page = getPage(pageId);

    console.log('get-page-content, pageId=' + pageId);
    if (!page) return res.status(400).send("Page not found");

    const html = await page.content();
    await generatePdf(page, pageId);

    return res.send({ html });
  } catch (error) {
    const response = "Error while getting content. ";
    console.error(response + error);
    return res.status(500).send(response);
  }
});

export default router;
