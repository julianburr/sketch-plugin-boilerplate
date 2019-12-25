//
//  SampleFramework.h
//  SampleFramework
//
//  Created by Gao Cong on 2019/12/25.
//  Copyright © 2019 gc. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <Foundation/Foundation.h>
#include "MOJavaScriptObject.h"

//! Project version number for SampleFramework.
FOUNDATION_EXPORT double SampleFrameworkVersionNumber;

//! Project version string for SampleFramework.
FOUNDATION_EXPORT const unsigned char SampleFrameworkVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <SampleFramework/PublicHeader.h>

@interface SampleFramework : NSObject

- (void)runBusyOnBackGround:(MOJavaScriptObject *)closure;

@end
