export class ApiResponse {
  public success: "Y" | "N";
  public status: number;

  constructor(
    statusCode: number,
    additionalProperties?: { [key: string]: unknown }
  ) {
    const firstDigit = Number(String(statusCode)[0]);

    this.status = statusCode;
    this.success = firstDigit < 4 ? "Y" : "N";
    Object.assign(this, additionalProperties);
  }
}
