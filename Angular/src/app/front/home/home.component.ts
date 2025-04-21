import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') chatMessagesRef!: ElementRef;

  isChatOpen = false;
  newMessage = '';
  loading = false;
  messages: { sender: 'user' | 'bot'; text: string }[] = [];

  private API_URL = 'https://f6f4-34-83-206-100.ngrok-free.app/ask';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    // Nothing needed here anymore
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    this.scrollToBottom();
  }

  sendMessage(): void {
    const msg = this.newMessage.trim();
    if (!msg || this.loading) return;
  
    this.messages.push({ sender: 'user', text: msg });
    this.newMessage = '';
    this.loading = true;
  
    this.scrollToBottom();
  
    // Add fake typing message
    const typingIndex = this.messages.push({ sender: 'bot', text: '✍️ Typing...' }) - 1;
  
    const payload = { query: msg };
  
    this.http.post<any>(this.API_URL, payload).subscribe({
      next: (res) => {
        const botReply = res?.response || 'No response received.';
  
        // Replace the typing message with the actual reply
        this.messages[typingIndex] = { sender: 'bot', text: botReply };
        this.loading = false;
  
        setTimeout(() => this.scrollToBottom(), 50);
      },
      error: (err) => {
        console.error('API error:', err);
        this.messages[typingIndex] = {
          sender: 'bot',
          text: '❌ Oops! Something went wrong. Try again.'
        };
        this.loading = false;
  
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });
  }
  
  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const container = this.chatMessagesRef?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
