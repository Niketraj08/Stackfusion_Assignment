from rest_framework import serializers

from .models import Booking, ParkingLot, Slot, Vehicle


class ParkingLotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingLot
        fields = "__all__"


class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = "__all__"


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = "__all__"


class BookingSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.vehicle:
            representation['vehicle'] = VehicleSerializer(instance=instance.vehicle).data
        if instance.slot:
            representation['slot'] = SlotSerializer(instance=instance.slot).data
        return representation

    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ["start_time", "end_time"]
