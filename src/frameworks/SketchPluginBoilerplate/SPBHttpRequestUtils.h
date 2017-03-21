//
//  SPBHttpRequestUtils.h
//  SketchPluginBoilerplate
//
//  Created by Julian Burr on 21/3/17.
//  Copyright © 2017 Julian Burr. All rights reserved.
//

#ifndef SPBHttpRequestUtils_h
#define SPBHttpRequestUtils_h

@interface SPBHttpRequestUtils:NSObject

+(void)sendRequest:(NSURLRequest *)request withMetaData:(NSDictionary*)metaData withIdentifier:(NSString *)identifier;

+(void)setResponse:(NSDictionary *)response forIdentifier:(NSString *)identifier;
+(NSDictionary *)getResponseForIdentifier:(NSString *)identifier;

@end

#endif /* SPBHttpRequestUtils_h */
