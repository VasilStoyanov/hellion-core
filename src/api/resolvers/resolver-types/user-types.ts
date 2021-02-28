import UserRoles from "../../../config/user-roles";

export interface RegisterUserType {
    user: {
        email: string
        password: string
        firstName: string
        lastName: string
    }
}

export interface CreateUserType {
    user: {
        username: string
        email: string
        password: string
        firstName: string
        lastName: string
        roles: UserRoles[]
    }
}

export interface UserLoginType {
    credentials: {
        email: string
        password: string
    }
}

export interface UserChangePassType {
    changeUserPasswordParams: {
        password: string
        newPassword: string
    }
}

export interface ConfirmEmailType {
    emailConfirmationUuid: string
}

export interface UserSubscriptionType {
    subscribe: boolean
}

export interface UserEmailRestorationType {
    restorationEmail: string
}

export  interface ResetPassConfirmationType {
    restorePasswordUUID: string
    newPassword: string
}
