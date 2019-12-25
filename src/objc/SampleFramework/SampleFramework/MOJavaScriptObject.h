#import <Foundation/Foundation.h>
@import JavaScriptCore;

NS_ASSUME_NONNULL_BEGIN

@interface MOJavaScriptObject : NSObject

@property (readonly) JSObjectRef JSObject;

@property (readonly) JSContextRef JSContext;

@end

NS_ASSUME_NONNULL_END
