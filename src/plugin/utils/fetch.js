export class HttpRequest {
  constructor () {
    this.url = null;
    this.options = {};
    this.callback = null;

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
    return this;
  }

  setOptions (options) {
    const { callback, ...rest } = options;
    this.options = rest || {};
    this.callback = callback || null;
    return this;
  }

  setCallback (callback) {
    this.callback = callback;
    return this;
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

  send () {
    this.createRequest();
    if (this.request && SPBHttpRequestUtils) {
      SPBHttpRequestUtils.sendRequest_withMetaData_withIdentifier(this.request, {callback: this.callback}, this.identifier);
    }
  }
}

export const handleResponses = fn => {
  const responses = SPBHttpRequestUtils.getResponses();
  if (typeof fn !== 'function' || !responses) {
    return;
  }
  for (let key in responses) {
    const response = responses[key];
    const callback = response.callback;
    fn(`${callback}.ALWAYS`, response);
    if (response.result == 'error') {
      fn(`${callback}.FAILURE`, response);
    } else {
      fn(`${callback}.SUCCESS`, response);
    }
  }
}

export default (url, options) => {
  // We need an URL to be able to create request instance
  if (!url) {
    return;
  }
  // Initiate and return request class instance
  const request = new HttpRequest();
  request.setUrl(url);
  if (options) {
    request.setOptions(options);
  }
  return request;
}

