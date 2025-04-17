interface Root {
    message: string
    success: boolean
    status: any
    date: string
}

interface AccessToken {
    role: string
    token: string
}

export interface LoginResponse extends Root {
    access_token: AccessToken
}
interface Policy {
    id: string
    name: string
    description: string
    isActive: boolean
    annualAllowance: number
    sickAllowance: number
    personalAllowance: number
    carryForwardLimit: number
    requiresApproval: boolean
    requiresDocumentation: boolean
    minDaysBeforeRequest: number
    createdAt: string
    updatedAt: string
}

export interface GetAllLeavePolicyResponse extends Root {
    policies: Policy[]
}
export interface GetLeavePolicyResponse extends Root {
    policy: Policy;
}