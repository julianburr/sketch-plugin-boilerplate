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

+(NSMutableArray *) list{
    static NSMutableArray* messageList = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        messageList = [[NSMutableArray alloc] init];
    });
    return messageList;
}

+(void)send:(NSString *)message {
    // Set packet contents
    [self setPayload:message];
    // Init method selector for method we want to call on AppController (look at AppControler.h of slack).
    SEL runPluginCmdSel = NSSelectorFromString(@"runPluginCommandWithIdentifier:fromBundleAtURL:");
    // Make sure AppController responds to our selector so sketch doesn't crash. AppController is exposed via [NSApp delegate]
    // NSApp in this case is the application loading the framework (sketch), not the plugin itself.
    if( ![[NSApp delegate] respondsToSelector:runPluginCmdSel] ){
        NSLog(@"Sketch delegate not responding to selector: runPluginCommandWithIdentifier:fromBundleAtURL:");
        return;
    }
    // Determine plugin path
    // NOTE: hard coded as of now :/
    NSString *pluginPath = [[[[NSFileManager defaultManager] URLsForDirectory:NSApplicationSupportDirectory inDomains:NSUserDomainMask] firstObject] path];
    NSLog(@"Plugin Path I: %@", pluginPath);
    pluginPath = [pluginPath stringByAppendingPathComponent:@"com.bohemiancoding.sketch3/Plugins"];
    pluginPath = [pluginPath stringByAppendingPathComponent:@"sketch-plugin-boilerplate.sketchplugin"];
    NSURL *pluginUrl = [NSURL fileURLWithPath:pluginPath];
    NSLog(@"Plugin Path II: %@", pluginPath);
    // Finally, call the plugin method "handlebridgemessage". On the sketch side, it will read the message and process it
    [[NSApp delegate] performSelector:runPluginCmdSel withObject:@"handleBridgeMessage" withObject:pluginUrl];
    NSLog(@"Plugin Path II: %@", pluginUrl);
    return;
}

+(void)setPayload:(NSString *)message {
    [[self list] addObject:message];
}

+(NSString *)getPayload{
    id obj = [[self list] objectAtIndex:0];
    [[self list] removeObjectAtIndex:0];
    return obj;
}

@end

