export class HttpRequest {
  constructor () {
    this.url = null;
    this.options = {};
    this.callbacks = {};

    // Create unique request identifier
    //  This will also be used to store and get the callbacks
    //  to handle the response
    const uid = (Math.random() * 1000000).toString(36);
    const ts = new Date().getTime();
    this.identifier = NSString.stringWithString(`${uid}---${ts}`);

    this.request = null;
    this.body = NSMutableData.data();

    // Needs to be a string that will not be used in the request data
    //  so it can be used as identifier for data separation
    this.boundary = `--------------------------BOUNDARY--${String(this.identifier)}`;
  }

  setUrl (url) {
    this.url = url;
  }

  setCallback (callback, type) {
    this.callbacks[type] = callback;
  }

  setOptions (options) {
    this.options = options || {};
  }

  createRequest () {
    if (!this.url) {
      return;
    }

    log('this.options')
    log(this.options)

    // Initializes request with this.url
    this.initRequest();

    // Header
    if (this.options.headers) {
      for (let field in this.options.headers) {
        this.addRequestHeaderField(this.options.headers[field], field);
      }
    }

    const method = this.validateMethod();
    this.request.setHTTPMethod(method);
    if (method !== 'GET') {
      // Automatically set the multipart header for everything that is not GET,
      //  so we don't need to do it manually on every request...
      const contentType = NSString.stringWithString(`multipart/form-data; boundary=${this.boundary}`);
      this.addRequestHeaderField('Content-Type', contentType);
    }

    // Normal parameters
    if (this.options.args) {
      for (let key in this.props.args) {
        const value = this.props.args[name];
        if (method === 'GET') {
          this.url += this.url.indexOf('?') === -1 ? '?' : '';
          this.url += `&${key}=${value}`;
          this.setRequestUrl();
        } else {
          this.addRequestBoundary();
          this.appendRequestBody(`Content-Disposition: form-data; name="${key}"\r\n\r\n${value}`)
        }
      }
    }

    // Attached files
    if (this.options.files && method !== 'GET') {
      for (let key in this.props.files) {
        const path = this.props.files[key];
        const fileData = NSData.alloc().initWithContentsOfFile(path);
        if (!fileData) {
          return;
        }
        const split = path.split('/');
        const fileName = split[split.length - 1];

        this.addRequestBoundary();
        this.appendRequestBody(`Content-Disposition: form-data; name="${key}"; filename="${fileName}"\r\n`);
        this.appendRequestBody('Content-Type: application/octet-stream\r\n\r\n');
        this.appendRequestBody(fileData);
      }
    }

    // Close body and add it to request
    this.addRequestBoundary();
    this.request.setHTTPBody(this.body);
  }

  addRequestHeaderField (value, field) {
    this.request && this.request.addValue_forHTTPHeaderField(value, field);
  }

  addRequestBoundary (postfix = '') {
    this.body && this.body.appendData(this.stringToData(`\r\n--${this.boundary}${postfix}\r\n`));
  }

  initRequest () {
    this.setRequestUrl();
  }

  setRequestUrl () {
    let nsurl = NSString.stringWithString(this.url);
    nsurl = nsurl.stringByAddingPercentEscapesUsingEncoding(NSUTF8StringEncoding);
    nsurl = NSURL.URLWithString(nsurl);

    if (!this.request) {
      this.request = NSMutableURLRequest.requestWithURL(nsurl);
    } else {
      this.request.setURL(nsurl);
    }
  }

  validateMethod () {
    // Allowed request methods
    if (this.options.method && ['GET', 'POST', 'PUT', 'DELETE'].includes(this.options.method.toUpperCase())) {
      return this.options.method.toUpperCase();
    }
    log('## No valid request method defined');
    return 'GET';
  }

  appendRequestBody (string) {
    this.body.appendData(string.isKindOfClass && string.isKindOfClass(NSData) ? string : this.stringToData(string));
  }

  stringToData (string) {
    return NSString.stringWithString(string).dataUsingEncoding(NSUTF8StringEncoding);
  }

  saveCallbacks () {
    let threadDictionary = NSThread.mainThread().threadDictionary();
    threadDictionary[`HTTPRequestCallbacks::${String(this.identifier)}`] = this.callbacks;
  }

  static clearCallbacks (identifier, response) {
    //...
  }

  static triggerCallbacks (identifier, response) {
    //...
  }

  then (callback) {
    log('try to set `then` callback')
    log(callback)
    this.setCallback(callback, 'success');
    return this;
  }

  catch (callback) {
    this.setCallback(callback, 'failure');
    return this;
  }

  always (callback) {
    this.setCallback(callback, 'always');
    return this;
  }

  send (success, failure, always) {
    success && this.setCallback(success, 'success');
    failure && this.setCallback(failure, 'failure');
    always && this.setCallback(always, 'always');

    this.createRequest();
    this.saveCallbacks();

    log('Send request')
    log(this.identifier);
    log(this.url);
    log(this.options);
    log(this.callbacks);

    log('checks')
    log(SPBHttpRequestUtils)
    log(this.request)
    if (this.request && SPBHttpRequestUtils) {
      SPBHttpRequestUtils.sendRequest_withMetaData_withIdentifier(this.request, null, this.identifier);
    }
  }
}

export const handleResponses = () => {
  const responses = SPBHttpRequestUtils.getResponses();
  log('responses')
  log(responses);
  for (let key in responses) {
    log('The response for ' + key)
    log(responses[key])
  }
}

export default (url, options) => {
  const request = new HttpRequest();
  request.setUrl(url);
  request.setOptions(options);
  return request;
}

