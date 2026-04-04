import "dotenv/config";

interface SheerIdVerificationResponse {
  verificationId: string;
  currentStep: string;
  status?: string;
}

interface SheerIdStatusResponse {
  currentStep: string;
  status?: string;
  verificationId: string;
}

export class SheerIdService {
  private readonly baseUrl = "https://services.sheerid.com/rest/v2";
  private readonly programId = process.env.SHEERID_PROGRAM_ID;
  private readonly skipVerification = process.env.SKIP_VERIFICATION === "true";

  shouldSkipVerification(): boolean {
    return this.skipVerification;
  }

  async startVerification(data: {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    university: string;
    graduationYear: number;
  }): Promise<SheerIdVerificationResponse> {
    if (!this.programId) {
      throw new Error("SHEERID_PROGRAM_ID is not configured");
    }

    const response = await fetch(
      `${this.baseUrl}/verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId: this.programId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          birthDate: data.birthDate,
          organization: {
            name: data.university,
          },
          metadata: {
            graduationYear: data.graduationYear,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`SheerID API error: ${response.status} — ${errorBody}`);
    }

    return response.json() as Promise<SheerIdVerificationResponse>;
  }

  async getVerificationStatus(
    verificationId: string,
  ): Promise<SheerIdStatusResponse> {
    if (!this.programId) {
      throw new Error("SHEERID_PROGRAM_ID is not configured");
    }

    const response = await fetch(
      `${this.baseUrl}/verification/${verificationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`SheerID API error: ${response.status} — ${errorBody}`);
    }

    return response.json() as Promise<SheerIdStatusResponse>;
  }
}
