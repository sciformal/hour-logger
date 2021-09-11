export class ResponseUtilities {
    public static headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
    }
    
    public static apiResponse(body: any, statusCode: number) {
        return {
            statusCode,
            headers: this.headers,
            body: JSON.stringify(body)
        }
    }
}

