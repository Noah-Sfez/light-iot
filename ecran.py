import machine
import time
import neopixel
import st7735
from machine import Pin

spi = machine.SPI(1, baudrate=20000000, polarity=0, phase=0, sck=Pin(10), mosi=Pin(11))
dc = machine.Pin(13, machine.Pin.OUT)
rst = machine.Pin(12, machine.Pin.OUT)
cs = machine.Pin(14, machine.Pin.OUT)

tft = st7735.TFT(spi, dc, rst, cs)
tft.initr()
tft.rgb(True)
tft.fill(tft.GREEN)

LED_PIN = 0
NUM_PIXELS = 16

np = neopixel.NeoPixel(machine.Pin(LED_PIN), NUM_PIXELS)

def set_all_pixels(red, green, blue):
    for i in range(NUM_PIXELS):
        np[i] = (red, green, blue)
    np.write()


def led_circle_test():
    print("Début du test du cercle de LEDs...")
    # Rouge
    set_all_pixels(255, 0, 0)
    time.sleep(1)
    # Vert
    set_all_pixels(0, 255, 0)
    time.sleep(1)
    # Bleu
    set_all_pixels(0, 0, 255)
    time.sleep(1)
    # Blanc
    set_all_pixels(255, 255, 255)
    time.sleep(1)
    # Éteindre les LEDs
    set_all_pixels(0, 0, 0)
    print("Test terminé.")

led_circle_test()