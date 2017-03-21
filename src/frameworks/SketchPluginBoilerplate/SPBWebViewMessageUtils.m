//
//  SPBWebViewMessageUtils.m
//  SketchPluginBoilerplate
//
//  Created by Julian Burr on 8/3/17.
//  Copyright © 2017 Julian Burr. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import "SPBWebViewMessageUtils.h"

@implementation SPBWebViewMessageUtils

+(NSMutableArray *) list {
    static NSMutableArray* messageList = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        messageList = [[NSMutableArray alloc] init];
    });
    return messageList;
}

+(void)send:(NSString *)message {
    [self setPayload:message];
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
    // Finally, call the plugin method "handlebridgemessage". On the sketch side, it will read the message and process it
    [[NSApp delegate] performSelector:runPluginCmdSel withObject:@"handleBridgeMessage" withObject:pluginUrl];
    return;
}

+(void)setPayload:(NSString *)message {
    [[self list] addObject:message];
}

+(NSString *)getPayload {
    id obj = [[self list] objectAtIndex:0];
    [[self list] removeObjectAtIndex:0];
    return obj;
}

@end

