const ALLOWED_METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'destroy'
];

const BOUNDARY = '-------------------------------------FETCHBOUNDARY--';

export function createRequest ({url, method, headers = {}, body = {}, files = {}}) {
  log('create request call')
  log(url)
  log(method)
  log(headers)
  log('---')

  // Validate method
  method = String(method).toLowerCase();
  method = ALLOWED_METHODS.includes(method) ? method : 'get';

  if (method === 'get') {
    if (!url.includes('?')) {
      url += '?';
    }
    Object.keys(body).forEach(key => {
      url += `&${key}=${body[key]}`;
    });
  }

  log('url')
  log(url);
  const request = NSMutableURLRequest.requestWithURL(
    NSURL.alloc().initWithString(url)
  );

  request.setHTTPMethod(method);

  // Set request headers
  for (let key in headers) {
    request.addValue_forHTTPHeaderField(headers[key], key);
  }

  if (method !== 'get') {
    request.setHTTPBody(buildRequestBody(body, files));
  }

  log('create request');
  log(request);
  return request;
}

function stringToData (string) {
  return NSString
    .stringWithString(string)
    .dataUsingEncoding(NSUTF8StringEncoding);
}

export function buildRequestBody (body, files) {
  let requestBody = NSMutableData.data();

  // TODO: flatten body arguments
  // e.g. foo.bar.hello = world ==> foo[bar][hello] = world
  for (let key in body) {
    requestBody.appendData(stringToData(BOUNDARY));
    const bodyString = `Content-Disposition: form-data; name="${key}"\r\n\r\n${body[key]}`;
    requestBody.appendData(stringToData(bodyString));
  }

  for (let key in files) {
    const filePath = files[key];
    const fileData = NSData
      .alloc()
      .initWithContentsOfFile(filePath);

    if (!fileData) {
      log('File not found!');
      log(filePath);
      return;
    }

    const split = filePath.split('/');
    const fileName = split[split.length - 1];

    requestBody.appendData(stringToData(BOUNDARY));
    
    const contentDisposition = `Content-Disposition: form-data; name="${key}"; filename="${fileName}"\r\n`;
    requestBody.appendData(stringToData(contentDisposition));
    
    const contentType = `Content-Type: application/octet-stream\r\n\r\n`;
    requestBody.appendData(stringToData(contentType));
    requestBody.appendData(fileData);
  }

  requestBody.appendData(stringToData(BOUNDARY));
  return requestBody;
}