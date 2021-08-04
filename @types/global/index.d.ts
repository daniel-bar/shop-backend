export { };

declare global {
    declare namespace NodeJS {
        interface ProcessEnv {
            readonly PORT: string;
            readonly HTTP_ACCESS_IP: string;
            readonly DB_ENDPOINT: string;
            readonly JWT_PWD: string;
            readonly ADMIN_EMAIL: string;
            readonly ADMIN_EMAIL_PASSWORD: string;
        }
    }
}