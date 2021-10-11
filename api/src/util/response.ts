export class ResponseUtilities {
    public static headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
    }
    
    public static createAPIResponse(body: any, statusCode: number = 200) {
        return {
            statusCode,
            headers: this.headers,
            body: JSON.stringify(body)
        }
    }

    public static createErrorResponse(message: string, statusCode: number = 400) {
        return {
            statusCode,
            headers: this.headers,
            body: JSON.stringify({ message })
        }
    }
}

