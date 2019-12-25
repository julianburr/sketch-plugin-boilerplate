//
//  SampleFramework.m
//  SampleFramework
//
//  Created by Gao Cong on 2019/12/25.
//  Copyright © 2019 gc. All rights reserved.
//

#import <Foundation/Foundation.h>

#include "SampleFramework.h"

@implementation SampleFramework

- (void)runBusyOnBackGround:(MOJavaScriptObject *)closure {
  dispatch_async(dispatch_get_global_queue(QOS_CLASS_BACKGROUND, 0), ^(void) {
    
    for (long i = 0; i < 10000000000; i++) {}
    
    dispatch_async(dispatch_get_main_queue(), ^(void) {
      NSArray *args = @[@"runBusyOnFrameworkDone"];
      JSContext *ctx = [JSContext contextWithJSGlobalContextRef:(JSGlobalContextRef)closure.JSContext];
      JSObjectRef fn = [closure JSObject];
      JSValue *value = [JSValue valueWithJSValueRef:fn inContext:ctx];
      [value callWithArguments:args];
    });
  });
}

@end

