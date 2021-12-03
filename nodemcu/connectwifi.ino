#include <ESP8266WiFi.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <SimpleTimer.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

/** THÔNG TIN KẾT NỐI INTERNET */
String apiKey = "API_KEY";   // Mã API của ThingSpeak
const char *ssid = "tên_wifi";     // Tên wifi , VD: “Wifi vp”
const char *pass = "mật_khẩu";         // Mật khẩu wifi
const char* server = "api.thingspeak.com";

//Giờ bắt đầu và dừng tưới buổi sáng trong ngày (giờ)
int MORNING_START_WATER_TIME=7; 
int MORNING_END_WATER_TIME=10;

//Giờ bắt đầu và dừng tưới buổi chiều trong ngày (giờ)
int EVEN_START_WATER_TIME=16; 
int EVEN_END_WATER_TIME=18;  

//Độ dài mỗi lần bơm (tính bằng giây 0s~59s)
int PUMB_ON_LENGTH = 30;
//Thời điểm bắt đầu bơm (tính theo phút 0p~59p) VD:  Với 10:05:00 đặt 10 thì 10:10:00 bắt đầu bơm trong 30s với biến PUMB_ON_LENGTH 
int MINUTE_KICK = 0;

/* KHAI BÁO BIẾN */
#define SCREEN_WIDTH 128 // chiều rộng của OLED theo pixels
#define SCREEN_HEIGHT 64 // chiều cao của OLED theo pixels
#define OLED_RESET -1    // Reset pin # (or -1 if sharing Arduino reset pin)
#define DHTPIN D4        //vị trí kết nối cảm biến DHT11 với ESP8266
#define RELAYPIN D5      //Vị trí kết nối rơ le bật tắt bơm
#define SOIL_MOIST_1_PIN A0 // Chân PE4 nối với cảm biến độ ẩm
#define DRY_SOIL 66       //Độ ẩm là khô với giá trị 66 
#define WET_SOIL 88       //Độ ẩm là ướt với giá trị 88
#define TIME_PUMP_ON  15  // Thời gian bật bơm nước
boolean PUMP_STATUS=0;     // Biến lưu trạng thái bơm >> 1:ON 0:OFF
int TIME_BTW=2;           //Khoảng cách thời gian giữa 2 lần tưới (giờ)
int currentHour=0;         //Giờ hiện tại
int currentMinute=0;       //Phút hiện tại
int currentSecond=0;       //Giây hiện tại
int soilMoist = 0;        //Độ ẩm của đất

/** KHỞI TẠO ĐỐI TƯỢNG **/
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
SimpleTimer timer;
WiFiClient client;
DHT dht(DHTPIN, DHT11);

/**
 * HÀM THIẾT LẬP TIẾN TRÌNH
 */
void setup() {
  Serial.begin(115200); // mở cổng serial, tần số từ 9600 bps
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C); //khởi tạo I2C địa chỉ 0x3C (128x64)
  display.clearDisplay();
  pinMode(RELAYPIN, OUTPUT);
  dht.begin();
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Đã kết nối WiFi");
  timeClient.begin();
  timeClient.setTimeOffset(25200);//Múi giờ GMT+7 có giá trị TimeOffset là 25200
}  

/**
 * VÒNG LẶP QUY TRÌNH
 */
void loop(){
  Serial.print("========================");
  Serial.println(timeClient.getFormattedTime());
  while(!timeClient.update()) {
    timeClient.forceUpdate();
  }
  currentHour = timeClient.getHours();
  currentMinute= timeClient.getMinutes();
  currentSecond= timeClient.getSeconds();
  
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  Serial.print("Độ ẩm không khí: ");
  Serial.println(h);
  Serial.print("Nhiệt độ không khí: ");
  Serial.println(t);
  
  getSoilMoist();
  if(soilMoist> 100){
    display.setCursor(0,0);
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.print("Do am dat:");
    display.setTextSize(1);
    display.print("100%");
    display.setCursor(0,20);
    display.setTextSize(1);
    display.print("Do am KK:");
    display.setTextSize(1);
    display.print(h);
    display.println(" %");
    display.setCursor(0,40);
    display.setTextSize(1);
    display.print("Nhiet do:");
    display.setTextSize(1);
    display.print(t);
    display.println(" C");
    display.display();
    delay(250);
    display.clearDisplay();
  }else if(soilMoist<0){
    display.setCursor(0,0);
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.print("Do am dat:");
    display.setTextSize(1);
    display.println("0%");
    display.setCursor(0,20);
    display.setTextSize(1);
    display.print("Do am KK:");
    display.setTextSize(1);
    display.print(h);
    display.println(" %");
    display.setCursor(0,40);
    display.setTextSize(1);
    display.print("Nhiet do:");
    display.setTextSize(1);
    display.print(t);
    display.println(" C");
    display.display();
    delay(250);
    display.clearDisplay();
  }else if(soilMoist>=0 && soilMoist<= 100){  
    display.setCursor(0,0);
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.print("Do am dat:");
    display.setTextSize(1);
    display.print(soilMoist);
    display.println(" %");
    display.setCursor(0,20);
    display.setTextSize(1);
    display.print("Do Am kk:");
    display.setTextSize(1);
    display.print(h);
    display.println(" %");
    display.setCursor(0,40);
    display.setTextSize(1);
    display.print("Nhiet do:");
    display.setTextSize(1);
    display.print(t);
    display.println(" C");
    display.display();
    delay(250);
    display.clearDisplay();
  }

  /**
   * KIỂM TRA ĐIỀU KIỆN
   * Để mỗi lần tưới là 30s. Mỗi ngày tưới trung bình 5 lần thì cần thỏa mãn điều kiện sau:
   * 1. Khoảng thời gian tưới trong giới hạn START_WATER_TIME đến END_WATER_TIME
   * 2. Giờ hiện tại chia hết cho 2
   * 3. Số phút bằng 0
   * 4. Số giây thỏa mãn nhỏ hơn hoặc bằng 25
   */

    Serial.print("CONDITION: ");
    Serial.print( (currentHour >= MORNING_START_WATER_TIME && currentHour <= MORNING_END_WATER_TIME) || (currentHour >= EVEN_START_WATER_TIME && currentHour <= EVEN_END_WATER_TIME) );
    Serial.print("||");
    Serial.print(currentHour >= MORNING_START_WATER_TIME && currentHour <= MORNING_END_WATER_TIME); 
    Serial.print("||");
    Serial.print(currentHour >= EVEN_START_WATER_TIME && currentHour <= EVEN_END_WATER_TIME);
    Serial.print("||");
    Serial.print(currentHour % TIME_BTW == 0);
    Serial.print("||");
    Serial.println(currentMinute == MINUTE_KICK && currentSecond <= PUMB_ON_LENGTH);
    Serial.print("PUMP_STATUS: ");
    Serial.println(PUMP_STATUS);
    if( ( (currentHour >= MORNING_START_WATER_TIME && currentHour <= MORNING_END_WATER_TIME) 
           || (currentHour >= EVEN_START_WATER_TIME && currentHour <= EVEN_END_WATER_TIME) ) && (currentMinute == MINUTE_KICK && currentSecond <= PUMB_ON_LENGTH)){
      Watering();
    }else{
      digitalWrite(RELAYPIN, HIGH);
      PUMP_STATUS=0;
    }

  /**
   * GỬI DỮ LIỆU ĐẾN MÁY CHỦ
   */
  if (client.connect(server, 80)){ //api.thingspeak.com
    String postStr = apiKey;
      postStr += "&field1=";
      postStr += String(soilMoist);
      postStr += "&field2=";
      postStr += String(h);
      postStr += "&field3=";
      postStr += String(t);
      postStr += "&field4=";
      postStr += String(PUMP_STATUS);
      postStr += "";
    client.print("POST /update HTTP/1.1\n");
    client.print("Host: api.thingspeak.com\n");
    client.print("Connection: close\n");
    client.print("X-THINGSPEAKAPIKEY: " + apiKey + "\n");
    client.print("Content-Type: application/x-www-form-urlencoded\n");
    client.print("Content-Length: ");
    client.print(postStr.length());
    client.print("\n\n");
    client.print(postStr);
  }
  client.stop();
}

/**
Hàm điều khiển bơm
 1.Khi độ ẩm nhỏ hơn DRY_SOIL(khô) thì máy bơm sẽ được BẬT 
 2.Khi độ ẩm lớn hơn WET_SOIL(nước) hoặc nằm trong khoảng 66~88 
 thì máy bơm sẽ được TẮT
**/
void Watering(void){ 
  Serial.println("AUTO RUN");
  if (soilMoist < DRY_SOIL){
    Serial.println("BẬT Bơm");
    turnPumpOn();
  }else if(soilMoist > WET_SOIL || DRY_SOIL < soilMoist < WET_SOIL){
    Serial.println("TẮT Bơm");
    turnPumpOff();
  }
  Serial.println("====================");
}

/***************************************************
* Bật bơm trong thời gian định sẵn
****************************************************/
void turnPumpOn(){
  PUMP_STATUS = 1;
  digitalWrite(RELAYPIN, LOW);
}
/***************************************************
* Tắt bơm trong thời gian định sẵn
****************************************************/
void turnPumpOff(){
  PUMP_STATUS = 0;
  digitalWrite(RELAYPIN, HIGH);
}

/***************************************************
* Hàm lấy thông tin độ ẩm của đất
****************************************************/
void getSoilMoist(void){
  int i = 0;
  soilMoist = 0;
  for (i = 0; i < 10; i++) {
    soilMoist += analogRead(SOIL_MOIST_1_PIN); //Đọc giá trị cảm biến độ ẩm đất
    delay(50);
  }
  soilMoist = soilMoist / (i);
  soilMoist = map(soilMoist, 1023, 0, 0, 100); //Ít nước:0%  ==> Nhiều nước 100%

  Serial.print("Độ ẩm đất hiện tại là: ");
  Serial.println(soilMoist);
}
