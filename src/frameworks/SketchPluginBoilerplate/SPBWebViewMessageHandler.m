//
//  SPBWebViewMessageHandler.m
//  SketchPluginBoilerplate
//
//  Created by Julian Burr on 8/3/17.
//  Copyright © 2017 Julian Burr. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>

#import "SPBWebViewMessageHandler.h"
#import "SPBWebViewMessageUtils.h"

@implementation SPBWebViewMessageHandler

-(void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    NSLog(@"SPBWebViewMessageHandler received event %@", message.body);
    [SPBWebViewMessageUtils send:message.body];
}

@end
