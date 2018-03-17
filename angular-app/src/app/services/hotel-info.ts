import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()

export class HotelInfo {

    private HotelId: string;
    private hasAmen: boolean = false;
    private hasHotelImg: boolean = false;
    private HotelName: string;
    private location: string;
    private price: string;
    private reviews: any;
    private rating: string;
    private ratingImage: string;
    private description:string;
    private amenities: string[] = [];
    private images: string[] = [];
    private _amenitiesList: BehaviorSubject<string[]> = new BehaviorSubject([]);
    private _imagesList: BehaviorSubject<string[]> = new BehaviorSubject([]);

    private images[] = new Array();

    constructor() {}

    public getHotelData(id: string) {
      this.HotelId = id;
      const ref = firebase.database().ref('/hotels/' + this.HotelId);
      ref.once('value')
          .then((snapshot) => {// ** My only change ** or use snapshot
          this.setHotelName(snapshot.child('name').val());
          this.setPrice(snapshot.child('price').val());
          this.setLocation(snapshot.child('location/all').val());
          this.setDescription(snapshot.child('attr/description').val());
          this.setRating(snapshot.child('rating/rating').val());
          this.setRatingImage(snapshot.child('rating/rating-img').val());
          this.setReview(snapshot.child('rating/reviews').val());
      });
      this.retrieveAmenities();
      this.retrieveHotelImg();
    }
// method to get hotel name from firebase
    public setHotelName(name:string){
      this.HotelName = name;
    }

    public getHotelName(): string {
       return this.HotelName;
    }
// method to get hotel Price from firebase
    public setPrice(HotelPrice:string) {
      this.price = HotelPrice;
    }

    public getPrice(): string {
      return this.price;
    }
// method to get hotel location from firebase
    public setLocation(HotelLocation:string){
       this.location = HotelLocation;
    }

    public getLocation():string{
         return this.location;
    }
// method to get hotel description from firebase
    public setDescription(hotelDescription:string){
          this.description = hotelDescription;
    }

    public getDescription(){
            return this.description;
    }
// method to get hotel review from firebase
    public setReview(review:string) {
      this.reviews = review;
    }
    public getReview(){
       return this.reviews;
    }
// method to get hotel rating from firebase
    public setRating(rating:string){
      this.rating = rating;
    }
    public getRating(){
      return this.rating;
    }
// method to get rating image from firebase
    public RatingImage(){
      var ratingImages: string;
      firebase.database().ref('/hotels/' + this.HotelId+ '/rating').once('value')
          .then((snapshot) => {// ** My only change ** or use snapshot
              this.setRatingImage(snapshot.child('rating-img').val());
      });
    }

    public setRatingImage(ratingImages:string){
       this.ratingImage = ratingImages;
    }

    public getRatingImage(){
         return this.ratingImage;
    }
// method to get hotel images from firebase
    private retrieveHotelImg(): void {
      const HotelImg_ref = firebase.database().ref('/hotels/' + this.HotelId+"/images/");

      HotelImg_ref.once('value')
        .then((snapshot) => {
          const countImg = snapshot.numChildren();
          console.log("Image Count: " + countImg);
          for(var i = 0; i < countImg; i++) {
            var Imgnumber = i.toString();
            this.setHotelImg(snapshot.child(Imgnumber).val());
            //console.log('Room: ' + snapshot.child(number).val());
          }
    });
  }

    public hasHotelImg() : boolean {
      return this.hasHotelImg;
    }

    public setHotelImg(HotelImages:string){
       this.images.push(HotelImages);
       this._imagesList.next(this.images);
    }

    public getHotelImg(): Observable<string[]>{
        return this._imagesList.asObservable();
    }

// method to get hotel amenities from firebase
    private retrieveAmenities(): void {
      const amenities_ref =  firebase.database().ref('/hotels/' + this.HotelId+"/amenities/");

      amenities_ref.child('room/').once('value')
        .then((snapshot) => {

          const countRoom = snapshot.numChildren();
          console.log("room count: " + countRoom);
          for(var i = 0; i < countRoom; i++) {
            var number = i.toString();
            this.setAmenities(snapshot.child(number).val());
            //console.log('Room: ' + snapshot.child(number).val());
          }
        });

        amenities_ref.child('hotel/').once('value')
        .then((snapshot) => {
          const countHotel = snapshot.numChildren();
          console.log("room count: " + countHotel);
          for(var i = 0; i < countHotel; i++) {
            var number = i.toString();
            this.setAmenities(snapshot.child(number).val());
            //console.log('Hotel: ' + snapshot.child(number).val());
          }
        });
    }

    public hasAmenities() : boolean {
      return this.hasAmen;
    }

    public setAmenities(HotelAmenity:string){
       this.amenities.push(HotelAmenity);
       this._amenitiesList.next(this.amenities);

    }

    public getAmenities(): Observable<string[]>{
        return this._amenitiesList.asObservable();
    }

    private retrieveImages(): void {
      const images_ref =  firebase.database().ref('/hotels/' + this.HotelId+"/images/");

      images_ref.once('value')
        .then((snapshot) => {
          const countImage = snapshot.numChildren();
          for(var i = 0; i < countImage; i++) {
            var number = i.toString();
            this.setImages(snapshot.child(number).val());
          }
        });
    }

    public setImages(image:string){
      this.images.push(image);
   }

   public getImages():any{
       return this.images;
   }
}
