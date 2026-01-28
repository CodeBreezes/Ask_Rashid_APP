import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";
import axios from "axios";
import { BASE_API_URL } from "../api/apiConfig";

const getMonthMatrix = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let matrix = [];
  let week = new Array(7).fill(null);
  let dayCounter = 1;

  for (let i = firstDay; i < 7; i++) {
    week[i] = dayCounter++;
  }
  matrix.push(week);

  while (dayCounter <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      week[i] = dayCounter++;
    }
    matrix.push(week);
  }
  return matrix;
};

const SlotPickerScreen = ({ navigation }) => {
  const [calendarData, setCalendarData] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [daySlots, setDaySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/api/AdminCalender/GetUpcomingSlotsOnly`
      );
      setCalendarData(res.data);
      extractAvailableDates(res.data);
    } catch (e) {
      Alert.alert("Error", "Unable to load calendar");
    } finally {
      setLoading(false);
    }
  };

  const extractAvailableDates = (data) => {
    let dates = [];
    data.forEach((y) => {
      y.months.forEach((m) => {
        m.days.forEach((d) => {
          if (d.availableSlots.length > 0) dates.push(d.date);
        });
      });
    });
    setAvailableDates(dates);
  };

  const hasAvailability = (day) => {
    const m = currentMonth.getMonth() + 1;
    const y = currentMonth.getFullYear();
    const formatted = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availableDates.includes(formatted);
  };

  const changeMonth = (direction) => {
    let newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const buildSlotsForDay = (date) => {
    let slots = [];
    let bookedTimes = [];

    calendarData.forEach((y) => {
      y.months.forEach((m) => {
        m.days.forEach((d) => {
          if (d.date === date) {
            d.bookings.forEach((b) => {
              bookedTimes.push({ start: b.start, end: b.end });
            });

            // Now create available slots
            d.availableSlots.forEach((s) => {
              const duration = d.slotDuration;
              let startTime = new Date(`${date}T${s.start}`);
              let endTime = new Date(`${date}T${s.end}`);

              while (startTime < endTime) {
                let next = new Date(startTime.getTime() + duration * 60000);
                if (next <= endTime) {
                  const startStr = startTime.toTimeString().substring(0, 5);
                  const endStr = next.toTimeString().substring(0, 5);

                  // Check if this slot overlaps with any booked slot
                  const isBooked = bookedTimes.some(bt => startStr >= bt.start && startStr < bt.end);

                  slots.push({
                    slotId: s.slotId,
                    date: date,
                    start: startStr,
                    end: endStr,
                    booked: isBooked
                  });
                }
                startTime = next;
              }
            });
          }
        });
      });
    });

    setDaySlots(slots);
  };


  const onSelectDate = (day) => {
    const m = currentMonth.getMonth() + 1;
    const y = currentMonth.getFullYear();
    const date = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(date);
    buildSlotsForDay(date);
  };

  const onSelectSlot = (slot) => {
    setVisible(false);
    const endedDateTime = `${slot.date}T${slot.end}:00`;
    navigation.navigate("BookingScreen", {
      startedDate: slot.date,
      startedTime: slot.start,
      endedTime: endedDateTime,
      slotId: slot.slotId
    });
  };


  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const matrix = getMonthMatrix(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        setVisible(false);
        navigation.navigate("BookingScreen");
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.title}>Book Your Session</Text>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                navigation.navigate("BookingScreen");
              }}
            >
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {!selectedDate && (
            <View>
              <Text style={styles.subtitle}>
                Select a date to view slots
              </Text>

              <View style={styles.monthHeader}>
                <TouchableOpacity onPress={() => changeMonth(-1)}>
                  <Text style={styles.navArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthText}>{monthName}</Text>
                <TouchableOpacity onPress={() => changeMonth(1)}>
                  <Text style={styles.navArrow}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weekRow}>
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <Text key={d} style={styles.weekText}>{d}</Text>
                ))}
              </View>

              {matrix.map((week, i) => (
                <View key={i} style={styles.weekRow}>
                  {week.map((day, idx) => {
                    if (!day) return <View key={idx} style={styles.dayCell} />;

                    const available = hasAvailability(day);

                    return (
                      <TouchableOpacity
                        key={idx}
                        disabled={!available}
                        onPress={() => onSelectDate(day)}
                        style={[
                          styles.dayCell,
                          available && styles.availableDay
                        ]}
                      >
                        <Text style={[
                          styles.dayText,
                          available && styles.availableText
                        ]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          )}

          {selectedDate && (
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity onPress={() => setSelectedDate(null)}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>

              <ScrollView style={{ maxHeight: 300 }}>
                {daySlots.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.slotBox,
                      s.booked && { backgroundColor: "#eee", borderColor: "#ccc" }
                    ]}
                    onPress={() => !s.booked && onSelectSlot(s)}
                    disabled={s.booked}
                  >
                    <Text style={[styles.slotText, s.booked && { color: "#999" }]}>
                      {s.start} - {s.end} {s.booked ? "(Booked)" : ""}
                    </Text>
                  </TouchableOpacity>
                ))}


                {daySlots.length === 0 && (
                  <Text style={{ textAlign: "center", marginTop: 20 }}>
                    No slots available
                  </Text>
                )}
              </ScrollView>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};

export default SlotPickerScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    elevation: 6
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "700"
  },
  close: {
    fontSize: 22,
    color: "#ff4444"
  },
  subtitle: {
    textAlign: "center",
    marginTop: 10,
    color: "#555"
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15
  },
  navArrow: {
    fontSize: 22,
    fontWeight: "bold"
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600"
  },
  weekRow: {
    flexDirection: "row"
  },
  weekText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    color: "#666"
  },
  dayCell: {
    flex: 1,
    height: 40,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8
  },
  dayText: {
    color: "#bbb"
  },
  availableDay: {
    borderWidth: 2,
    borderColor: "#2563eb"
  },
  availableText: {
    color: "#000",
    fontWeight: "600"
  },
  backText: {
    color: "#2563eb",
    marginBottom: 10,
    fontWeight: "600"
  },
  slotBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8
  },
  slotText: {
    fontSize: 15,
    fontWeight: "600"
  }
});
