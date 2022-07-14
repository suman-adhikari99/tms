import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaceOrderDto } from '../orders/dto/place-order.dto';
import { ResponsibilityRepository } from './responsibilities.repository'

@Injectable()
export class ResponsibilityService {
  constructor(
    @InjectRepository(ResponsibilityRepository) private responsibilityRepository: ResponsibilityRepository,
  ) {}


  
  async getAllResponsibility() {
    const responsibility = this.responsibilityRepository.find();
    return responsibility;
  }

  // async placeOrder(order: PlaceOrderDto) {
  //   const newOrder = await this.responsibilityRepository.create(order);
  //   this.responsibilityRepository.save(newOrder);
  // }
}
