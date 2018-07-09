import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from 'request';

import { processHeaders } from './processHeaders';
import { IRetsContext } from '../client/IRETSContext';
import * as Errors from './errors';
import { RETSSession } from '../client/RETSSession';

export function callRETSMethod(context: IRetsContext, session: RequestAPI<Request, CoreOptions, RequiredUriUrl>, client: RETSSession): any {
    
}

callRetsMethod = (retsContext, promisifiedRetsSession, client) ->
  debug("RETS #{retsContext.retsMethod}:", retsContext.queryOptions)
  Promise.try () ->
    request = {}
    if client.settings.method == 'POST'
      request.form = retsContext.queryOptions
    else
      request.qs = retsContext.queryOptions
    promisifiedRetsSession(request)
  .catch (error) ->
    debug("RETS #{retsContext.retsMethod} error:", error)
    Promise.reject(error)
  .spread (response, body) ->
    if response.statusCode != 200
      error = new errors.RetsServerError(retsContext, response.statusCode, response.statusMessage)
      debug("RETS #{retsContext.retsMethod} error: #{error.message}")
      return Promise.reject(error)
    retsContext.headerInfo = headersHelper.processHeaders(response.rawHeaders)
    retsContext.body = body
    retsContext.response = response
    return retsContext
