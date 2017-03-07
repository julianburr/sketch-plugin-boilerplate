//
//  SPBWebViewMessageHandler.h
//  SketchPluginBoilerplate
//
//  Created by Julian Burr on 8/3/17.
//  Copyright © 2017 Julian Burr. All rights reserved.
//

#ifndef SPBWebViewMessageHandler_h
#define SPBWebViewMessageHandler_h

@interface SPBWebViewMessageHandler:WKScriptMessage<WKScriptMessageHandler>

-(void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message;

@end

#endif /* SPBWebViewMessageHandler_h */
