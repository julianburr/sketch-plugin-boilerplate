//
//  SPBWebViewMessageUtils.h
//  SketchPluginBoilerplate
//
//  Created by Julian Burr on 8/3/17.
//  Copyright © 2017 Julian Burr. All rights reserved.
//

#ifndef SPBWebViewMessageUtils_h
#define SPBWebViewMessageUtils_h

@interface SPBWebViewMessageUtils:NSObject

+(void)send:(NSString *)message;
+(void)setPayload:(NSString *)message;
+(NSString *)getPayload;

@end

#endif /* SPBWebViewMessageUtils_h */
