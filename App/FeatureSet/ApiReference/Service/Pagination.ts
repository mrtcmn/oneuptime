import { CodeExamplesPath, ViewsPath } from "../Utils/Config";
import ResourceUtil, { ModelDocumentation } from "../Utils/Resources";
import LocalCache from "CommonServer/Infrastructure/LocalCache";
import { ExpressRequest, ExpressResponse } from "CommonServer/Utils/Express";
import LocalFile from "CommonServer/Utils/LocalFile";

const Resources: Array<ModelDocumentation> = ResourceUtil.getResources(); // Get all resources from ResourceUtil

export default class ServiceHandler {
  public static async executeResponse(
    req: ExpressRequest,
    res: ExpressResponse,
  ): Promise<void> {
    let pageTitle: string = ""; // Initialize page title
    let pageDescription: string = ""; // Initialize page description
    const page: string | undefined = req.params["page"]; // Get the page parameter from the request
    const pageData: any = {}; // Initialize page data object

    pageTitle = "Pagination"; // Set page title
    pageDescription = "Learn how to paginate requests with OneUptime API"; // Set page description

    // Get response code from LocalCache or LocalFile
    pageData.responseCode = await LocalCache.getOrSetString(
      "pagination",
      "response",
      async () => {
        return await LocalFile.read(
          `${CodeExamplesPath}/Pagination/Response.md`, // Read Response.md file from CodeExamplesPath
        );
      },
    );

    // Get request code from LocalCache or LocalFile
    pageData.requestCode = await LocalCache.getOrSetString(
      "pagination",
      "request",
      async () => {
        return await LocalFile.read(
          `${CodeExamplesPath}/Pagination/Request.md`, // Read Request.md file from CodeExamplesPath
        );
      },
    );

    // Render the page with the page data
    return res.render(`${ViewsPath}/pages/index`, {
      page: page, // Pass the page parameter
      resources: Resources, // Pass all resources
      pageTitle: pageTitle, // Pass the page title
      pageDescription: pageDescription, // Pass the page description
      pageData: pageData, // Pass the page data
    });
  }
}