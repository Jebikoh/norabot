export default class AudioLength {
    hours: number;
    minutes: number;
    seconds: number;
    constructor(props: { hours: number; minutes: number; seconds: number }) {
        this.hours = props.hours;
        this.minutes = props.minutes;
        this.seconds = props.seconds;
    }
}