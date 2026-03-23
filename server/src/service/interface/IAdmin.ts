interface IAdmin {
    email: string;
    password: string;
    role: string;
    success: boolean;
    message: string;
    token: string | null;
    error: Error | null;
}

interface IAdminServiceResponse {
    success: boolean;
    message: string;
    token?: string | null;
    error?: Error;
}

export default IAdmin;
export { IAdminServiceResponse };