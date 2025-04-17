from machine import Pin, I2C, PWM
import ds1307
import time
from ssd1306 import SSD1306_I2C
import neopixel
from time import sleep

# LED Configuration (Neopixel)
LED_PIN = 0
NUM_PIXELS = 16
np = neopixel.NeoPixel(Pin(LED_PIN), NUM_PIXELS)

def set_all_pixels(r, g, b):
    for i in range(NUM_PIXELS):
        np[i] = (r, g, b)
    np.write()

def led_circle_test():
    print("▶ Test du cercle de LEDs...")
    set_all_pixels(255, 0, 0)   # Rouge
    time.sleep(1)
    set_all_pixels(0, 255, 0)   # Vert
    time.sleep(1)
    set_all_pixels(0, 0, 255)   # Bleu
    time.sleep(1)
    set_all_pixels(255, 255, 255) # Blanc
    time.sleep(1)
    set_all_pixels(0, 0, 0)     # OFF
    print("✅ LEDs OK.")

# OLED Configuration (SSD1306)
pix_res_x = 128
pix_res_y = 64
i2c = I2C(1, scl=Pin(27), sda=Pin(26), freq=200000)
oled = SSD1306_I2C(pix_res_x, pix_res_y, i2c)

def oled_test():
    oled.fill(0)
    oled.text("Hello,", 0, 0)
    oled.text("ca marche !", 0, 10)
    oled.text("SSD1306 OK", 0, 20)
    oled.show()
    time.sleep(2)
    oled.fill(0)
    oled.show()
    time.sleep(1)
    oled.text("OLED READY :)", 0, 30)
    oled.show()

# PWM for sound (Buzzer)
pwm = PWM(Pin(28))  # Assure-toi que le pin 28 est connecté au buzzer ou haut-parleur
pwm.duty_u16(1)  # Régler le volume (0 à 65535)

# Fréquences des notes (Hz)
NOTES = {
    "C4": 262, "D4": 294, "E4": 330, "F4": 349,
    "G4": 392, "A4": 440, "B4": 494,
    "C5": 523, "D5": 587, "E5": 659, "F5": 698, "G5": 784,
    "R": 0  # Silence (pause)
}

# Mélodie de "Twinkle Twinkle Little Star"
MELODY = [
    "C4", "C4", "G4", "G4", "A4", "A4", "G4", "R",
    "F4", "F4", "E4", "E4", "D4", "D4", "C4", "R"
]

# Durées des notes (1 = longue, 0.5 = courte)
DURATIONS = [
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5
]

# Fonction pour jouer une note
def play_note(note, duration):
    frequency = NOTES[note]
    if frequency > 0:
        pwm.freq(frequency)  # Régler la fréquence
        pwm.duty_u16(30)  # Activer le son
    else:
        pwm.duty_u16(0)  # Silence pour les pauses

    sleep(duration)
    pwm.duty_u16(0)  # Arrêter la note
    sleep(0.1)  # Pause entre les notes

# Test de l'amplificateur
def amplifier_test():
    print("▶ Test de l'amplificateur...")
    pwm.freq(440)  # Fréquence A4 (440 Hz)
    pwm.duty_u16(32768)  # Volume moyen pour tester l'amplificateur
    time.sleep(2)  # Laisser l'amplificateur fonctionner pendant 2 secondes
    pwm.duty_u16(0)  # Arrêter l'amplificateur
    print("✅ Test de l'amplificateur terminé.")

# Configuration de l'I2C pour le DS1307 (RTC)
sda = Pin(16)  # Modifier selon ton câblage
scl = Pin(17)  # Modifier selon ton câblage
i2c_rtc = I2C(0, scl=scl, sda=sda, freq=100000)

# Initialisation du module DS1307
rtc = ds1307.DS1307(i2c_rtc, 0x68)

# Heure cible à laquelle la musique doit commencer (par exemple 07:00:00)
target_hour = 7
target_minute = 0 
target_second = 0

# Lancer les tests
print("\n=== Lancement des tests ===")
led_circle_test()
oled_test()
amplifier_test()  # Test de l'amplificateur ajouté ici
print("🎉 Tests terminés. LEDs, écran et amplificateur OK.")

# Boucle infinie pour vérifier l'heure et lancer la musique à l'heure cible
while True:
    ds = rtc.datetime  # Lire la date et l'heure du DS1307
    heure = "{:02d}:{:02d}:{:02d}".format(ds[3], ds[4], ds[5])  # Format HH:MM:SS
    print("Heure actuelle:", heure)  # Affichage de l'heure sur la console

    # Vérification si l'heure actuelle correspond à l'heure cible
    if ds[3] == target_hour and ds[4] == target_minute and ds[5] == target_second:
        print("Il est l'heure de jouer la musique!")
        for i in range(len(MELODY)):
            play_note(MELODY[i], DURATIONS[i])
        # Une fois la mélodie jouée, attendre avant de redémarrer
        sleep(60)  # Attendre une minute avant de vérifier à nouveau l'heure
    else:
        time.sleep(1)  # Pause de 1 seconde pour éviter une boucle trop rapide

