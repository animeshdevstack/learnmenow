interface IConfiguration {
    PORT: number,
    MONGO_URI: string,
    BASE_URL: string,
    JWT_SECRET: string,
    FRONTEND_URL: string,
    ADMIN_GMAIL_ACCOUNT: string,
    ADMIN_GMAIL_PASSWORD: string
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CLIENT_SECRET: string,
    GOOGLE_CALLBACK_URL: string,
    GOOGLE_SIGNUP_CALLBACK_URL: string,
};

export default IConfiguration;
