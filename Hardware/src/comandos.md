g++ main.cpp ../libCFHidApi.a -o rf_tool -I.. -lusb-1.0

uvicorn api:app --reload --port 5000

sudo chmod 666 /dev/bus/usb/*/* 

./rf_tool --gravar numGravar

./rf_tool --ler

/etc/systemd/system/totem-api.service;


sudo nano /etc/udev/rules.d/99-sensor-usb.rules