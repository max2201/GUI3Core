import { BaseObjectType } from '../constants/BaseObjectType'
import type { IObjectDto } from '../interface/Object'
import type { IRequestDto } from '../interface/Requests'
import { BaseObject } from '../model/BaseObject'
import { ClientObject } from '../model/ClientObject'
import { RequestObject } from '../model/RequestObject'
import { CallObject } from '../model/CallObject'
import { CallEditObject } from '@/core/model/CallEditObject'
import type { IClientDto } from '@/core/interface/Client'

export const createObjectInstance = (
  id: number,
  type: BaseObjectType,
  data?: IObjectDto,
  isEdit?: boolean,
) => {
  switch (type) {
    case BaseObjectType.Client: {
      return new ClientObject(id, data as IClientDto)
    }
    case BaseObjectType.Requst: {
      return new RequestObject(id, data as IRequestDto)
    }
    case BaseObjectType.Call: {
      if (isEdit) {
        return new CallEditObject(id, data)
      }
      return new CallObject(id, data)
    }
    default: {
      return new BaseObject(id, data, type)
    }
  }
}
