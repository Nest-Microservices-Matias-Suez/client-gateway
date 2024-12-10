import { Observable, } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const rpcError = exception.getError();

        if (
            typeof rpcError === 'object' &&
            'status' in rpcError &&
            'message' in rpcError
        ) {
            const status = isNaN( +rpcError.status ) ?
                400 : +rpcError.status;

            return response
                .status( status )
                .json( rpcError );
        }

        return response.status(400).json({
            status: 400,
            message: rpcError,
        });

    }
}