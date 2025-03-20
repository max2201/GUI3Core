import type { IClient } from '@/core/interface/Object'

export const isClient = (arg: any): arg is IClient => {
    if (typeof arg === 'object' && arg.BaseObjectType) {
        return true
    }

    return false
}