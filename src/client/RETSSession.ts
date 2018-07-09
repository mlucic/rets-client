import { createHash } from 'crypto';
import * as Request from 'request';

import { IClientConfiguration } from './IClientConfiguration';

metadata = require('./clientModules/metadata')
search = require('./clientModules/search')
object = require('./clientModules/object')

auth = require('./utils/auth')
normalizeUrl = require('./utils/normalizeUrl')
errors = require('./utils/errors')

URL_KEYS =
  GET_METADATA: "GetMetadata"
  GET_OBJECT: "GetObject"
  SEARCH: "Search"
  UPDATE: "Update"
  ACTION: "Action"
  LOGIN: "Login"
  LOGOUT: "Logout"

export class RETSSession {
    public readonly configuration: IClientConfiguration;
    private session: Request.RequestAPI<Request.Request, Request.CoreOptions, Request.RequiredUriUrl> | undefined;

    public constructor(configuration: IClientConfiguration) {
        this.configuration = configuration;
        const headers: { [key: string]: string } = {};
        headers['User-Agent'] = this.configuration.userAgent || 'RETS NodeJS-Client/5.x';
        headers['RETS-Version'] = this.configuration.version;
        if (this.configuration.userAgentPassword) {
            headers['RETS-UA-Authorization'] = 'Digest ' + createHash('md5').update([
                createHash('md5').update(`${this.configuration.userAgent}:${this.configuration.userAgentPassword}`).digest('hex'),
                '',
                this.configuration.sessionId || '',
                headers['RETS-Version']
            ].join(':')).digest('hex');
        }
        const requestOptions: Request.CoreOptions = {
            jar: Request.jar(),
            headers: headers,
            method: this.configuration.method || 'GET',
            auth: {
                user: this.configuration.username,
                pass: this.configuration.password,
                sendImmediately: false
            },
            timeout: this.configuration.timeout,
            proxy: this.configuration.proxyUrl,
            tunnel: this.configuration.useTunnel
        };
        this.session = Request.defaults(requestOptions);
    }

    public async login(): Promise<void> {
    }
}

    if @settings.proxyUrl
      defaults.proxy = @settings.proxyUrl
      if @settings.useTunnel
        defaults.tunnel = @settings.useTunnel
    
    @baseRetsSession = request.defaults defaults
    @loginRequest = Promise.promisify(@baseRetsSession.defaults(uri: @settings.loginUrl))


  login: () ->
    auth.login(@loginRequest, @)
    .then (retsContext) =>
      @systemData = retsContext.systemData
      @loginHeaderInfo = retsContext.headerInfo
      @urls = {}
      for key,val of URL_KEYS
        if @systemData[val]
          @urls[val] = normalizeUrl(@systemData[val], @settings.loginUrl)
          
      hasPermissions = true
      missingPermissions = []
      if @urls[URL_KEYS.GET_METADATA]
        @metadata = metadata(@baseRetsSession.defaults(uri: @urls[URL_KEYS.GET_METADATA]), @)
      else
        hasPermissions = false
        missingPermissions.push URL_KEYS.GET_METADATA
      if @urls[URL_KEYS.SEARCH]
        @search = search(@baseRetsSession.defaults(uri: @urls[URL_KEYS.SEARCH]), @)
      else
        hasPermissions = false
        missingPermissions.push URL_KEYS.SEARCH
      if @urls[URL_KEYS.GET_OBJECT]
        @objects = object(@baseRetsSession.defaults(uri: @urls[URL_KEYS.GET_OBJECT]), @)
      @logoutRequest = Promise.promisify(@baseRetsSession.defaults(uri: @urls[URL_KEYS.LOGOUT]))
      if !hasPermissions
        throw new errors.RetsPermissionError(missingPermissions)
        
      if @settings.userAgentPassword && @settings.sessionId
        a1 = crypto.createHash('md5').update([@settings.userAgent, @settings.userAgentPassword].join(":")).digest('hex')
        retsUaAuth = crypto.createHash('md5').update([a1, "", @settings.sessionId || "", @settings.version || @headers['RETS-Version']].join(":")).digest('hex')
        @headers['RETS-UA-Authorization'] = "Digest " + retsUaAuth
        
      return @

  # Logs the user out of the current session
  logout: () ->
    auth.logout(@logoutRequest, @)
    .then (retsContext) =>
      @logoutHeaderInfo = retsContext.headerInfo


Client.getAutoLogoutClient = (settings, handler) -> Promise.try () ->
  client = new Client(settings)
  client.login()
  .then () ->
    Promise.try () ->
      handler(client)
    .finally () ->
      client.logout()


module.exports = Client
