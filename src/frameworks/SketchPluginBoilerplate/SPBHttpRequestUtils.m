//
//  SPBHttpRequestUtils.m
//  SketchPluginBoilerplate
//
//  Created by Julian Burr on 21/3/17.
//  Copyright © 2017 Julian Burr. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import "SPBHttpRequestUtils.h"

@implementation SPBHttpRequestUtils

+(NSMutableDictionary *) responses {
    static NSMutableDictionary* responseMap = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        responseMap = [NSMutableDictionary dictionaryWithDictionary:@{}];
    });
    return responseMap;
}

+(void)sendRequest:(NSURLRequest *)request withMetaData:(id)metaData withIdentifier:(NSString *)identifier {
    NSMutableURLRequest* finalRequest = [request mutableCopy];
    if (!metaData) {
        metaData = [NSNull null];
    }
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
    
    [[session dataTaskWithRequest:finalRequest completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *) response;
        id payload;
        NSString *body;
        NSString *callback = metaData[@"callback"];
        if (!callback) {
            callback = @"HttpRequest";
        }
        [NSString stringEncodingForData:data encodingOptions:nil convertedString:&body usedLossyConversion:nil];
        if( [httpResponse statusCode] >= 300 ){
            payload = @{
                @"result":@"error",
                @"statusCode":[NSString stringWithFormat:@"%ld",(long)[httpResponse statusCode]],
                @"message":[NSHTTPURLResponse localizedStringForStatusCode:[httpResponse statusCode]],
                @"body":body,
                @"metaData":metaData,
                @"identifier":identifier,
                @"callback":callback
            };
        } else if ( !error ){
            payload = @{
                @"result":@"success",
                @"statusCode":[NSString stringWithFormat:@"%ld",(long)[httpResponse statusCode]],
                @"message":[NSHTTPURLResponse localizedStringForStatusCode:[httpResponse statusCode]],
                @"body":body,
                @"metaData":metaData,
                @"identifier":identifier,
                @"callback":callback
            };
        } else {
            NSLog(@"error = %@", error);
            NSLog(@"body = %@", body);
            payload = @{
                @"result":@"error",
                @"statusCode":@-1,
                @"message":[error localizedDescription],
                @"body":body,
                @"metaData":metaData,
                @"identifier":identifier,
                @"callback":callback
            };
        }
        
        NSLog(@"Sending async request done");
        [self setResponse:payload forIdentifier:identifier];
        
        // Set selector and check if Sketch responses to it to avoid crashes
        SEL runPluginCmdSel = NSSelectorFromString(@"runPluginCommandWithIdentifier:fromBundleAtURL:");
        if (![[NSApp delegate] respondsToSelector:runPluginCmdSel]) {
            NSLog(@"Sketch delegate not responding");
            return;
        }
        
        // Determine plugin path
        // NOTE: hard coded plugin file name as of now :/
        NSString *pluginPath = [[[[NSFileManager defaultManager] URLsForDirectory:NSApplicationSupportDirectory inDomains:NSUserDomainMask] firstObject] path];
        pluginPath = [pluginPath stringByAppendingPathComponent:@"com.bohemiancoding.sketch3/Plugins"];
        pluginPath = [pluginPath stringByAppendingPathComponent:@"sketch-plugin-boilerplate.sketchplugin"];
        NSURL *pluginUrl = [NSURL fileURLWithPath:pluginPath];
        // Finally, call the plugin method "handleHttpResponse". On the sketch side, it will read the response and process it,
        //  as well as calling possible callbacks that have been stored in the main thread dictionary
        [[NSApp delegate] performSelector:runPluginCmdSel withObject:@"handleHttpResponse" withObject:pluginUrl];
    }] resume];
}

+(void)setResponse:(NSDictionary *)response forIdentifier:(NSString *)identifier {
    [[self responses] setObject:response forKey:identifier];
}

+(NSDictionary *)getResponseForIdentifier:(NSString *)identifier {
    NSDictionary *response = [[self responses] objectForKey:identifier];
    [[self responses] removeObjectForKey:identifier];
    return response;
}

+(NSMutableDictionary *)getResponses {
    NSArray *keys = [[self responses] allKeys];
    NSMutableDictionary *responses = [NSMutableDictionary dictionaryWithDictionary:@{}];
    for (id key in keys) {
        [responses setValue:[self getResponseForIdentifier:key] forKey:key];
    }
    return responses;
}

@end
