import { MercadoPagoConfig } from '../../mercadoPagoConfig';
import type { PointChangeDeviceOperatingModeData } from './changeDeviceOperatingMode/types';
import type { PointCreatePaymentIntentData } from './createPaymentIntent/types';
import type { PointGetDevicesData } from './getDevices/types';
import type { PointGetPaymentIntentListData } from './getPaymentIntentList/types';
import type { PointSearchPaymentIntentData } from './searchPaymentIntent/types';
import type { PointCancelPaymentIntentData } from './cancelPaymentIntent/types';
import type { PointGetPaymentIntentStatusData } from './getPaymentIntentStatus/types';
import type { CancelPaymentIntentResponse, ChangeDeviceOperatingModeResponse, GetDevicesResponse, GetPaymentIntentListResponse, PaymentIntentResponse, PaymentIntentStatusResponse } from './commonTypes';
/**
 * Mercado Pago Point.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
export declare class Point {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago Create Payment Intent.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/createPaymentIntent.ts Usage Example }.
   */
    createPaymentIntent({ device_id, request, requestOptions }: PointCreatePaymentIntentData): Promise<PaymentIntentResponse>;
    /**
   * Mercado Pago Search Payment Intent.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/searchPaymentIntent.ts Usage Example }.
   */
    searchPaymentIntent({ payment_intent_id, requestOptions }: PointSearchPaymentIntentData): Promise<PaymentIntentResponse>;
    /**
   * Mercado Pago Cancel Payment Intent.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/cancelPaymentIntent.ts Usage Example }.
   */
    cancelPaymentIntent({ device_id, payment_intent_id, requestOptions }: PointCancelPaymentIntentData): Promise<CancelPaymentIntentResponse>;
    /**
   * Mercado Pago Get Payment Intent List.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/getPaymentIntentList.ts Usage Example }.
   */
    getPaymentIntentList(pointGetPaymentIntentListOptions?: PointGetPaymentIntentListData): Promise<GetPaymentIntentListResponse>;
    /**
   * Mercado Pago Get Payment Intent Status.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/getPaymentIntentStatus.ts Usage Example }.
   */
    getPaymentIntentStatus({ payment_intent_id, requestOptions }: PointGetPaymentIntentStatusData): Promise<PaymentIntentStatusResponse>;
    /**
   * Mercado Pago Get Devices.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/getDevices.ts Usage Example }.
   */
    getDevices({ request, requestOptions }: PointGetDevicesData): Promise<GetDevicesResponse>;
    /**
   * Mercado Pago Change Device Operating Mode.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/changeDeviceOperatingMode.ts Usage Example }.
   */
    changeDeviceOperatingMode({ device_id, request, requestOptions }: PointChangeDeviceOperatingModeData): Promise<ChangeDeviceOperatingModeResponse>;
}
